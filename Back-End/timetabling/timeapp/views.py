from . import serializers
from .serializers import UserSerializer
from django.shortcuts import render, redirect
from .models import UserData
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from .email_functionality import send_email


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
    serializer_class = serializers.UserLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            serializer = serializers.UserSerializer(user)
            token = RefreshToken.for_user(user)
            data = serializer.data
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