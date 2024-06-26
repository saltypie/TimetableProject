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
            queryset = queryset.filter(institution__name__istartswith=institution)
        if search_query:
            queryset = queryset.filter(dept_name__istartswith=search_query)
        return queryset 
class MeetingTimeViewSet(viewsets.ModelViewSet):
    queryset = MeetingTime.objects.all()
    serializer_class = MeetingTimeSerializer
    def get_queryset(self):
        queryset = MeetingTime.objects.all()
        institution = self.request.user.institution
        search_query = self.request.query_params.get('search', None)
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution__name__istartswith=institution)
        if search_query:
            queryset = queryset.filter(time__istartswith=search_query)
        return queryset 

class StreamViewSet(viewsets.ModelViewSet):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer
    def get_queryset(self):
        queryset = Stream.objects.all()
        institution = self.request.user.institution
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution__name__istartswith=institution)
        return queryset 
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    def get_queryset(self):
        queryset = Room.objects.all()
        institution = self.request.user.institution
        if institution:
            queryset = queryset.filter(institution__name__istartswith=institution)
        return queryset 
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    def get_queryset(self):
        queryset = Course.objects.all()
        search_query = self.request.query_params.get('search', None)
        institution = self.request.user.institution
        # institution = self.request.query_params.get('institution', None)
        if institution:
            queryset = queryset.filter(institution__name__istartswith=institution)
        if search_query:
            queryset = queryset.filter(name__istartswith=search_query)
        return queryset 


class ProfileUpdateAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # To handle file uploads

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

class InstitutionMemberView(viewsets.ModelViewSet):
    serializer_class = InstitutionMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        institution = self.request.user.institution
        print("User making request:", self.request.user, "Institution:", institution)
        return UserData.objects.filter(institution=institution)
    def patch(self, request, *args, **kwargs):
        print("Here",   request.data)
        try:
            serializer = InstitutionMemberSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserData.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

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