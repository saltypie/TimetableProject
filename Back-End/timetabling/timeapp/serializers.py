from rest_framework import serializers
from .models import Role, UserData, Department, MeetingTime, Stream, Room, Course,Profile
from django.contrib.auth import authenticate
from .email_functionality import send_email
from rest_framework.response import Response

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserData
        fields = ["id", "email", "fname", "lname", "is_active","password"]
        # extra_kwargs = {"password": {"write_only": True}}
    def create(self, validated_data):
        user = UserData.objects.create_user(**validated_data)
        # user.set_password(validated_data['password'])
        # user.role = Role.objects.get_or_create(name="unassigned")[0]
        # user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer class to authenticate users with email and password.
    """

    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        potential_user = UserData.objects.get(email=data["email"])
        u_email = data["email"]
        u_id = potential_user.id
        # print("theud-",u_email)
        user_isactive = potential_user.is_active
        if user_isactive:
            user = authenticate(**data)
            print(data["email"], data["password"], type(user))
            data["uid"]=u_id#!! new line
            # print(user.email)
            if user:
                return user
        else:
            send_email(u_email, "Did You Create A Tabler Account",f"To Whom It May Concern, \n Did you create a new account on Tabler? If so activate your account by clicking the link below \n http://localhost:8000/timeapp/api/activate/{u_id} \n Not You? Please Ignore This Email",)
            return potential_user
        raise serializers.ValidationError("Incorrect Credentials")
###
class NewPassSerializer(serializers.Serializer):
    model = UserData
    old_password = serializers.CharField(required=True)  
    new_password = serializers.CharField(required=True)  
####
# class InstructorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Instructor
#         fields = ['id', 'uid', 'name', 'institution']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'dept_name', 'courses', 'institution']

class MeetingTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingTime
        fields = ['pid', 'time', 'day', 'institution']

class StreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stream
        fields = ['stream_id', 'department', 'lessons_per_week', 'institution', 'course', 'meeting_time', 'room', 'instructor']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'r_number', 'seating_capacity', 'institution']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_number', 'course_name', 'max_numb_students', 'instructors', 'institution']

# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields=['user','photo_url','bio','second_email']
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'photo_url', 'bio', 'second_email']

    # def update(self, instance, validated_data):
    #     user = self.context['request'].user
    #     profile = Profile.objects.get(user=user)

    #     profile.photo_url = validated_data.get('photo_url', profile.photo_url)
    #     profile.bio = validated_data.get('bio', profile.bio)
    #     profile.second_email = validated_data.get('second_email', profile.second_email)
    #     profile.save()

    #     return profile
