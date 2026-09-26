from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=100, blank=True)
    professional_title = models.CharField(max_length=150, blank=True)
    skills = models.TextField(blank=True, help_text="Comma-separated list of skills")
    experience = models.TextField(blank=True)
    education = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    resume = models.FileField(upload_to='profile_resumes/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"