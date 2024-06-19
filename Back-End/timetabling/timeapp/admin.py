from django.contrib import admin
from .models import UserData, Role, Profile
# Register your models here.

admin.site.register(UserData)
admin.site.register(Role)
admin.site.register(Profile)