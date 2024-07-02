from . import serializers
from .serializers import *
from django.shortcuts import render, redirect
from .models import *
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, action
from .email_functionality import send_email
from rest_framework.parsers import MultiPartParser, FormParser
from .timetable_functionality import generate_timetables
from .visit_functionality import *

class RegisterView(GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            the_user = UserData.objects.get(email=request.data["email"])
            print("That Exists")
            return Response({"Message": "Email already exists"})
        except:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
    

class UserLoginAPIView(GenericAPIView):

    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            # serializer = serializers.UserSerializer(user)
            serializer = UserSerializer(user)
            token = RefreshToken.for_user(user)
            data = serializer.data
            data["institution"] = user.institution.name if user.institution else None
            data["is_application_accepted"] = user.is_application_accepted
            data["is_institution_approved"] = user.institution.is_institution_approved if user.institution else None
            print(data["is_institution_approved"]) 
            print(data["is_application_accepted"])
            data["role"] = user.role.name
            data["user_id"] = user.id
            data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"Message": "Incorrect Credentials"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def activate_user(request,id):
    try:
        the_user = UserData.objects.get(id=id)
        the_user.is_active=True
        the_user.save()
        return redirect('http://localhost:3000/login')
        # return Response({"success": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"Message": "Inexistent User"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def pass_email(request):
    try:
        u_email = request.data["email"]
        potential_user = UserData.objects.get(email=u_email)
        u_id = potential_user.id
        send_email(u_email, "Reset Password?", f"Greetings User, Click the link below to change your password \n http://localhost:3000/ResetPassword/{u_id}/")
        return Response({"Sent": True}, status=status.HTTP_200_OK)
    except:
        return Response({"Message": "Inexistent Email"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def pass_reset(request):
    try:        
        potential_user = UserData.objects.get(id=request.data["id"])
        print("ctrl-ef=",request.data["password"])
        potential_user.set_password(request.data["password"])
        potential_user.save()
        # return redirect('http://localhost:3000/login')
        return Response({"Changed": True}, status=status.HTTP_200_OK)
    except:
        return Response({"Message": "Unable To Change Password"}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(UpdateAPIView):
    serializer_class = NewPassSerializer
    permission_classes = [IsAuthenticated]
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        the_user = self.request.user
        if serializer.is_valid:
            if not the_user.check_password(request.data["old_password"]):
                return Response({"Message": "Incorrect Old Password"}, status=status.HTTP_400_BAD_REQUEST)
            the_user.set_password(request.data["new_password"])
            the_user.save()
            return Response({"Message": "Password Changed Successfully"}, status=status.HTTP_200_OK)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
#######
# class InstructorViewSet(viewsets.ModelViewSet):
#     queryset = Instructor.objects.all()
#     serializer_class = InstructorSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    def get_queryset(self):
        queryset = Department.objects.all()
        search_query = self.request.query_params.get('search', None)
        institution = self.request.user.institution
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution=institution)
        if search_query:
            queryset = queryset.filter(dept_name__istartswith=search_query)
        return queryset 
    def create(self, request, *args, **kwargs):
        institution = self.request.user.institution
        dept_name = request.data.get("dept_name")

        if not institution:
            return Response({"detail": "Institution is required."}, status=status.HTTP_400_BAD_REQUEST)

        if Department.objects.filter(dept_name=dept_name, institution=institution).exists():
            return Response({"detail": "Department already exists."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['institution'] = institution.id

        serializer = DepartmentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class MeetingTimeViewSet(viewsets.ModelViewSet):
    queryset = MeetingTime.objects.all()
    serializer_class = MeetingTimeSerializer
    def get_queryset(self):
        queryset = MeetingTime.objects.all()
        institution = self.request.user.institution
        search_query = self.request.query_params.get('search', None)
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution=institution)
        if search_query:
            queryset = queryset.filter(time__istartswith=search_query)
        return queryset 
    
    def create(self, request, *args, **kwargs):
        institution = self.request.user.institution
        time = request.data.get('time')
        day = request.data.get('day')
        
        if not institution:
            return Response({"detail": "Institution is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if MeetingTime.objects.filter(time=time, day=day, institution=institution).exists():
            return Response({"detail": "Meeting Time already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        data['institution'] = institution.id
        
        serializer = MeetingTimeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class StreamViewSet(viewsets.ModelViewSet):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer
    def get_queryset(self):
        queryset = Stream.objects.all()
        institution = self.request.user.institution
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution=institution)
        return queryset 
    def create(self, request, *args, **kwargs):
        institution = self.request.user.institution

        if not institution:
            return Response({"detail": "Institution is required."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['institution'] = institution.id

        serializer = StreamSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    def get_queryset(self):
        queryset = Room.objects.all()
        institution = self.request.user.institution
        if institution:
            queryset = queryset.filter(institution=institution)
        return queryset 
    def create(self, request, *args, **kwargs):
        institution = self.request.user.institution

        if not institution:
            return Response({"detail": "Institution is required."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['institution'] = institution.id

        serializer = RoomSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)   
        
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    def get_queryset(self):
        queryset = Course.objects.all()
        search_query = self.request.query_params.get('search', None)
        institution = self.request.user.institution
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution=institution)
        if search_query:
            queryset = queryset.filter(name__istartswith=search_query, institution=institution)
        return queryset 
    def create(self, request, *args, **kwargs):
        institution = self.request.user.institution

        if not institution:
            return Response({"detail": "Institution is required."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['institution'] = institution.id
        print(data["instructors"])
        # data["instructors"] = [int(instructor_id) for instructor_id in data["instructors"]]

        serializer = CourseSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProfileUpdateAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # handling file uploads

    def patch(self, request, *args, **kwargs):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)


class ProfileDetailView(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print("User making request:", user)
        return Profile.objects.filter(user=user)

# class InstitutionMemberView(viewsets.ModelViewSet):
#     serializer_class = InstitutionMemberSerializer
#     permission_classes = [IsAuthenticated]

class InstitutionMemberView(viewsets.ModelViewSet):
    serializer_class = InstitutionMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        institution = self.request.user.institution
        return UserData.objects.filter(institution=institution)

    def patch(self, request, *args, **kwargs):
        print("Here", request.data)
        try:
            # Find the UserData object for the current user
            user_data = UserData.objects.get(user=request.user)
            serializer = InstitutionMemberSerializer(user_data, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserData.DoesNotExist:
            return Response({"error": "UserData not found for this user"}, status=status.HTTP_404_NOT_FOUND)
            # return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

    @action(detail=False, methods=['get'], url_path='searchorcreate')
    def search_or_create(self, request):
        search_query = request.query_params.get('search', None)
        if search_query:
            role, created = Role.objects.get_or_create(name=search_query)
            serializer = self.get_serializer(role)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        return Response({"error": "Search query not provided"}, status=status.HTTP_400_BAD_REQUEST)

class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer


    def patch(self, request, *args, **kwargs):
        print("Here",   request.data)
        try:
            institute = Institution.objects.get(name=request.data["name"])
            serializer = InstitutionSerializer(institute, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Institution.DoesNotExist:
            return Response({"error": "Institution not found"}, status=status.HTTP_404_NOT_FOUND)
    def get_queryset(self):
        queryset = Institution.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(name__istartswith=search_query)
        print("Hi")
        print(queryset)
        return queryset
#######

@api_view(['GET'])
def make_timetable(request):  
    created_objects = generate_timetables(request.user)
    serializer1 = TimetableSerializer(created_objects['created_schedule'])
    serializer2 = LessonDetailSerializer(created_objects['created_classes'], many=True)
    return Response({'schedule':serializer1.data,'schedule_classes': serializer2.data})

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    def get_queryset(self):
        queryset = Timetable.objects.filter(institution = self.request.user.institution)
        institution = self.request.user.institution
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution=institution).select_related('author')
            # queryset[0].
            # print(queryset[0].author.fname)
        return queryset

    @action(detail=False, methods=['get'], url_path='by_vote')
    def tables_by_vote(self, request):
        institution = self.request.user.institution
        schedule_sets = Timetable.objects.filter(institution=institution) 
        votes = Vote.objects.all()   
        schedules_by_vote = {}
        for schedule_set in schedule_sets:
            for vote in votes:
                if vote.schedule == schedule_set:
                    if schedule_set.id not in schedules_by_vote:
                        schedules_by_vote[schedule_set.id] = 1
                    else:
                        schedules_by_vote[schedule_set.id] += 1
        return Response(schedules_by_vote)

class LessonDetailViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonDetailSerializer
    def get_queryset(self):
        queryset = Lesson.objects.all()
        institution = self.request.user.institution
        search_query = self.request.query_params.get('search', None)
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(timetable=search_query)
        return queryset

    @action(detail=False, methods=['get'], url_path='table')
    def table(self, request):
        institution = self.request.user.institution
        timetable = self.request.query_params.get('search', None).strip("/")
        if not timetable or not institution:
            return Response({"error": "Institution or timetable not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        lessons = Lesson.objects.filter(timetable=timetable)
        streams = Stream.objects.filter(institution=institution)
        meeting_times = MeetingTime.objects.filter(institution=institution)
        
        schedules = {}

        for stream in streams:
            print(streams)
            stream_key = f"{stream.department.dept_name}--{stream.id}"
            schedules[stream_key] = {}
            for meeting_time in meeting_times:
                day_key = meeting_time.day
                time_key = meeting_time.time
                
                if day_key not in schedules[stream_key]:
                    schedules[stream_key][day_key] = {}
                
                schedules[stream_key][day_key][time_key] = "No Lesson"

        for lesson in lessons:
            stream_key = f"{lesson.stream.department.dept_name}--{lesson.stream.id}"
            day_key = lesson.meeting_time.day
            time_key = lesson.meeting_time.time
            
            schedules[stream_key][day_key][time_key] = {
                'course': lesson.course.course_name,
                'instructor': lesson.instructor.email,
                'room': lesson.room.r_number
            }

        return Response(schedules)


class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer()

    def create(self, request, *args, **kwargs):
        institution = self.request.user.institution

        if not institution:
            return Response({"detail": "Institution is required."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['institution'] = institution.id

        serializer = VisitSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    @action(detail=False, methods=['get'], url_path='per_institution')
    def per_institution(self, request):
        return Response(visits_per_institution())
    @action(detail=False, methods=['get'], url_path='per_table')
    def per_table(self, request):
        return Response(visits_per_table())
    @action(detail=False, methods=['get'], url_path='per_action')
    def per_action(self, request):
        return Response(visits_per_action())
    @action(detail=False, methods=['get'], url_path='per_daypart')
    def per_day(self, request):
        return Response(visits_per_daypart())

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = UserData.objects.all()
    serializer_class = UserManagementSerializer
    
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    def create(self, request, *args, **kwargs):
        institution = self.request.user.institution
        if not institution:
            return Response({"detail": "Institution is required."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['institution'] = institution.id

        serializer = NotificationSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        members = UserData.objects.filter(institution=institution)
        for member in members:
            if member != self.request.user:
                send_email(member.email , "New Notification from Timetabulous", f"New Notification: {serializer.data['description']}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)        
    def get_queryset(self):
        current_user = self.request.user
        queryset = Notification.objects.filter(institution = current_user.institution)
            
        return queryset
    @action(detail=False, methods=['get'], url_path='caught_up')
    def caught_up(self, request):
        current_user = self.request.user
        queryset = Notification.objects.filter(institution = current_user.institution)
        # caught_up = True
        num_unread = 0
        for notification in queryset:
            if current_user not in notification.read_by.all():
                num_unread += 1
        # caught_up = (num_unread == 0)
        return Response({"num_unread": num_unread}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['get'], url_path='mark_read')
    def mark_read(self, request):
        current_user = self.request.user
        queryset = Notification.objects.filter(institution = current_user.institution)
        for notification in queryset:
            if current_user not in notification.read_by.all():
                notification.read_by.add(current_user)
        return Response({"success": True}, status=status.HTTP_200_OK)
    
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['commenter'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        queryset = Comment.objects.all().select_related('commenter')
        schedule_id = self.request.query_params.get('schedule', None)
        if schedule_id:
            schedule = Timetable.objects.get(id=schedule_id)
            queryset = Comment.get_comments_for_schedule(schedule).select_related('commenter')
        return queryset


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    @action(detail=False, methods=['get'], url_path='tally')
    def tally_votes(self,request):
        schedule_id = self.request.query_params.get('search', None)
        schedule = Timetable.objects.get(id=schedule_id)
        tally = Vote.total_vote_for_schedule(schedule)
        voters_value = Vote.objects.get(voter=self.request.user, schedule=schedule).value if Vote.objects.filter(voter=self.request.user, schedule=schedule).exists() else 0
        return Response({"tally": tally, "voters_value": voters_value}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['post'], url_path='takevote')
    def take_vote(self, request):
        data = request.data.copy()
        schedule_id = data["schedule"]
        schedule = Timetable.objects.get(id=schedule_id)
        users_vote = Vote.objects.filter(schedule=schedule, voter=self.request.user)

        if users_vote.exists():
            users_vote.delete()

        serializer = VoteSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    








# class UserLogoutAPIView(GenericAPIView):

#     permission_classes = (IsAuthenticated,)


#     def post(self, request, *args, **kwargs):
#         try:
#             refresh_token = request.data["refresh"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#             return Response(status=status.HTTP_205_RESET_CONTENT)
#         except Exception as e:
#             return Response(status=status.HTTP_400_BAD_REQUEST)