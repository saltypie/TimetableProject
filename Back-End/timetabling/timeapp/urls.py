from django.urls import path
# from .views import RegisterView, UserListView
# from .views import RegisterView, UserLoginAPIView, UserLogoutAPIView
from .views import RegisterView, UserLoginAPIView,activate_user
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
    # path('users/', UserListView.as_view(), name='user-list'),

]