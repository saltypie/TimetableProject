from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
class Institution(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    email = models.EmailField(max_length=100, unique=True)
    is_institution_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name

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
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_profile_set = models.BooleanField(default=False)
    is_application_accepted = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE,null=True, blank=True)

    role=models.OneToOneField(Role, on_delete=models.RESTRICT)#admin scheduler instructor

    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

def reduce_image_quality(image, quality=50):
    img = Image.open(image)
    img = img.convert('RGB')  # Ensure image is in RGB mode

    img_io = BytesIO()
    img.save(img_io, 'JPEG', quality=quality)

    img_file = InMemoryUploadedFile(
        img_io, None, image.name, 'image/jpeg', sys.getsizeof(img_io), None
    )

    return img_file
def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)   
class Profile(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE)
    photo_url = models.ImageField(upload_to=upload_to, blank=True, null=True, default='images/default.png')
    bio = models.CharField(max_length=150)
    second_email = models.EmailField(max_length=100, unique=True, null=True)

    def save(self, *args, **kwargs):
        if self.photo_url:
            self.photo_url = reduce_image_quality(self.photo_url)
        super().save(*args, **kwargs)


class Room(models.Model):
    r_number = models.CharField(max_length=6)
    seating_capacity = models.IntegerField(default=0)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    def __str__(self):
        return self.r_number


# class Instructor(models.Model):
#     uid = models.CharField(max_length=6)
#     name = models.CharField(max_length=25)
#     institution = models.ForeignKey(Institution, on_delete=models.CASCADE)

#     def __str__(self):
#         return f'{self.uid} {self.name}'


class MeetingTime(models.Model):
    # pid = models.CharField(max_length=4, primary_key=True)
    time = models.CharField(max_length=50, default='10:15 - 12:15')
    day = models.CharField(max_length=15)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)

    # def __str__(self):
    #     return f'{self.pid} {self.day} {self.time}'
    def __str__(self):
        return f'{self.day} {self.time}'

class Course(models.Model):
    course_number = models.CharField(max_length=5, primary_key=True)
    course_name = models.CharField(max_length=40)
    max_numb_students = models.CharField(max_length=65)
    instructors = models.ManyToManyField(UserData)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.course_number} {self.course_name}'


class Department(models.Model):
    dept_name = models.CharField(max_length=50)
    courses = models.ManyToManyField(Course)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)

    @property
    def get_courses(self):
        return self.courses

    def __str__(self):
        return self.dept_name


class Stream(models.Model):
    stream_id = models.CharField(max_length=25, primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    lessons_per_week = models.IntegerField(default=0)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, blank=True, null=True)
    meeting_time = models.ForeignKey(MeetingTime, on_delete=models.SET_NULL, null=True)
    # meeting_time = models.ForeignKey(MeetingTime, on_delete=models.CASCADE, blank=True, null=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, blank=True, null=True)
    instructor = models.ForeignKey(UserData, on_delete=models.CASCADE, blank=True, null=True)
    # instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, blank=True, null=True)
    def __str__(self):
        return f'Stream {self.stream_id}'
    def set_room(self, room):
        stream = Stream.objects.get(pk = self.stream_id)
        stream.room = room
        stream.save()

    def set_meeting_time(self, meeting_time):
        stream = Stream.objects.get(pk = self.stream_id)
        stream.meeting_time = meeting_time
        stream.save()

    def set_instructor(self, instructor):
        stream = Stream.objects.get(pk=self.stream_id)
        stream.instructor = instructor
        stream.save()

class Timetable(models.Model):
    # id = models.AutoField()
    time_made = models.DateTimeField(auto_now=True)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    author = models.ForeignKey(UserData, on_delete=models.CASCADE)
    def __str__(self):
        return f"Timetable: {self.id} Made on {self.time_made}"
class Lesson(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    instructor = models.ForeignKey(UserData, on_delete=models.CASCADE)
    # instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    meeting_time = models.ForeignKey(MeetingTime, on_delete=models.SET_NULL, null=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    stream = models.ForeignKey(Stream, on_delete=models.CASCADE)
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE)
    def __str__(self):
        return f'Lesson: {self.id} by {self.instructor} on {self.meeting_time}'

