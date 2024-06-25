from django.contrib import admin
from .models import UserData, Role, Profile, MeetingTime, Course, Department, Stream, Room, Institution
# Register your models here.

admin.site.register(UserData)
admin.site.register(Role)
admin.site.register(Profile)
admin.site.register(MeetingTime)
admin.site.register(Course)
admin.site.register(Department)
admin.site.register(Stream)
admin.site.register(Room)
admin.site.register(Institution)
