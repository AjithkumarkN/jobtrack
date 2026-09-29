from django.db import models
from cloudinary_storage.storage import RawMediaCloudinaryStorage
from django.contrib.auth.models import User

class Application(models.Model):
    STATUS_CHOICES = [
        ('Wishlist', 'Wishlist'),
        ('Applied', 'Applied'),
        ('Interview', 'Interview'),
        ('Offer', 'Offer'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    company_name = models.CharField(max_length=200)
    job_title = models.CharField(max_length=200)
    job_link = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Wishlist')
    applied_date = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True)
    salary_range = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    resume_file = models.FileField(upload_to='resumes/',storage=RawMediaCloudinaryStorage(),blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"
class Interview(models.Model):
    TYPE_CHOICES = [
        ('Phone', 'Phone'),
        ('Technical', 'Technical'),
        ('HR', 'HR'),
        ('Final', 'Final'),
        ('Other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    interview_date = models.DateTimeField()
    interview_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Phone')
    interviewer_name = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')

    def __str__(self):
        return f"{self.interview_type} interview - {self.application.job_title}"

class Task(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='tasks', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    due_date = models.DateField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title