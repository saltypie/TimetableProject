# Generated by Django 5.0.6 on 2024-07-16 14:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timeapp', '0007_alter_meetingtime_timeset'),
    ]

    operations = [
        migrations.AddField(
            model_name='timetable',
            name='timeset',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='timeapp.timeset'),
        ),
    ]