# Generated by Django 5.0.6 on 2024-06-24 16:43

import django.db.models.deletion
import timeapp.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=10)),
                ('email', models.EmailField(max_length=100, unique=True)),
                ('is_institution_approved', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('fname', models.CharField(max_length=100)),
                ('lname', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=100, unique=True)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_profile_set', models.BooleanField(default=False)),
                ('is_application_accepted', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('institution', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
                ('role', models.OneToOneField(on_delete=django.db.models.deletion.RESTRICT, to='timeapp.role')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course_number', models.CharField(max_length=10)),
                ('course_name', models.CharField(max_length=40)),
                ('max_numb_students', models.CharField(max_length=65)),
                ('instructors', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
            ],
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dept_name', models.CharField(max_length=50)),
                ('courses', models.ManyToManyField(to='timeapp.course')),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
            ],
        ),
        migrations.CreateModel(
            name='MeetingTime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.CharField(default='10:15 - 12:15', max_length=50)),
                ('day', models.CharField(max_length=15)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_url', models.ImageField(blank=True, default='images/default.png', null=True, upload_to=timeapp.models.upload_to)),
                ('bio', models.CharField(max_length=150)),
                ('second_email', models.EmailField(max_length=100, null=True, unique=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('r_number', models.CharField(max_length=6)),
                ('seating_capacity', models.IntegerField(default=0)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
            ],
        ),
        migrations.CreateModel(
            name='Stream',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lessons_per_week', models.IntegerField(default=0)),
                ('course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='timeapp.course')),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.department')),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
                ('instructor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('meeting_time', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='timeapp.meetingtime')),
                ('room', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='timeapp.room')),
            ],
        ),
        migrations.CreateModel(
            name='Timetable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_made', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.course')),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.department')),
                ('instructor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('meeting_time', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='timeapp.meetingtime')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.room')),
                ('stream', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.stream')),
                ('timetable', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.timetable')),
            ],
        ),
    ]
