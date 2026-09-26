from django.contrib import admin
from .models import Application, Interview, Task

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company_name', 'status', 'user', 'applied_date', 'created_at')
    list_filter = ('status',)
    search_fields = ('job_title', 'company_name')

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('application', 'interview_type', 'interview_date', 'status')
    list_filter = ('status', 'interview_type')
    search_fields = ('application__job_title', 'application__company_name')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'application', 'due_date', 'is_completed')
    list_filter = ('is_completed',)
    search_fields = ('title',)