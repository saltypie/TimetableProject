# Generated by Django 5.0.6 on 2024-07-15 13:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timeapp', '0005_comment_vote'),
    ]

    operations = [
        migrations.CreateModel(
            name='TimeSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15)),
                ('duration', models.IntegerField()),
                ('start_day', models.CharField(max_length=10)),
                ('end_day', models.CharField(max_length=10)),
                ('start_time', models.CharField(max_length=50)),
                ('end_time', models.CharField(max_length=50)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timeapp.institution')),
            ],
        ),
        migrations.AddField(
            model_name='meetingtime',
            name='timeset',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='timeapp.timeset'),
        ),
    ]
