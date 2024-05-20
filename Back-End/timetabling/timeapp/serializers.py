from rest_framework import serializers
from .models import Role, UserData
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
            # print(user.email)
            if user:
                return user
        else:
            send_email(u_email, "Did You Create A Tabler Account",f"To Whom It May Concern, \n Did you create a new account on Tabler? If so activate your account by clicking the link below \n http://localhost:8000/timeapp/api/activate/{u_id} \n Not You? Please Ignore This Email",)
            return potential_user
        raise serializers.ValidationError("Incorrect Credentials")
    
