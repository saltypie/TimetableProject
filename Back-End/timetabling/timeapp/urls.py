from django.urls import path
# from .views import RegisterView, UserListView
# from .views import RegisterView, UserLoginAPIView, UserLogoutAPIView
from .views import RegisterView, UserLoginAPIView,activate_user, pass_email, pass_reset
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    # path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    path('api/login/', UserLoginAPIView.as_view(), name='userlogin'),
    path('api/register/', RegisterView.as_view(), name="sign_up"),
    path('api/activate/<int:id>/', activate_user, name="activate_user"),
    path('api/pass_mail/', pass_email, name="pass_email"),
    path('api/new_pass/', pass_reset, name="pass_reset"),
    # path('users/', UserListView.as_view(), name='user-list'),

]