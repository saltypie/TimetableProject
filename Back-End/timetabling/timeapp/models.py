from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class Role(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name
class UserManager(BaseUserManager):

    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        extra_fields.setdefault("is_active", False)
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.role = Role.objects.get_or_create(name="unassigned")[0]
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', True)

        # user = self.create_user(email, password, **extra_fields)
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.role = Role.objects.get_or_create(name="admin")[0]
        user.save(using=self._db)

        return user



class UserData(AbstractUser):

    username = None
    fname = models.CharField(max_length=100)
    lname = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    # is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    # is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    role=models.OneToOneField(Role, on_delete=models.RESTRICT)

    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
