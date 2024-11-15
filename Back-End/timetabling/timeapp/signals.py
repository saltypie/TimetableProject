# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserData, Profile

@receiver(post_save, sender=UserData)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=UserData)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()