from django.urls import path, include
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from django.conf import settings
# from .views import RegisterView, UserListView
# from .views import RegisterView, UserLoginAPIView, UserLogoutAPIView
# from .views import RegisterView, UserLoginAPIView,activate_user, pass_email, pass_reset
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
# router.register(r'instructors', InstructorViewSet)
router.register(r'meetingtimes', MeetingTimeViewSet)
router.register(r'streams', StreamViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'profile', ProfileDetailView, basename="profile")
router.register(r'institutionmembers', InstitutionMemberView, basename="institutionmembers")
router.register(r'institutions', InstitutionViewSet, basename="institution")
router.register(r'departments', DepartmentViewSet, basename="department")
router.register(r'lessondetails', LessonDetailViewSet, basename="lessondetails")
router.register(r'timetables', TimetableViewSet, basename="timetables")
router.register(r'visits', VisitViewSet, basename="visits")
router.register(r'usermanagement', UserManagementViewSet, basename="usermanagement")
router.register(r'notifications', NotificationViewSet, basename="notifications")
router.register(r'votes', VoteViewSet, basename="votes")
router.register(r'comments', CommentViewSet, basename="comments")
# router.register(r'profileupdate', ProfileViewSet, basename="profile")

urlpatterns = [
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/', UserLoginAPIView.as_view(), name='userlogin'),
    path('api/register/', RegisterView.as_view(), name="sign_up"),
    path('api/activate/<int:id>/', activate_user, name="activate_user"),
    path('api/pass_mail/', pass_email, name="pass_email"),
    path('api/new_pass/', pass_reset, name="pass_reset"),
    path('api/profileupdate/', ProfileUpdateAPIView.as_view(), name='profile-update'),
    path('api/change_pass/', ChangePasswordView.as_view(), name='change_password'),
    path('api/make_table/', make_timetable, name='make_timetable'),
    path('api/viewsets/', include(router.urls)),
    # path('api/profile/update/', ProfileViewSet, basename='profile')
    # path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    # path('users/', UserListView.as_view(), name='user-list'),
]
# urlpatterns += [path('api/viewsets/roles/searchorcreate/', RoleViewSet.as_view({'get': 'searchorcreate'}), name='role-search-or-create'),]