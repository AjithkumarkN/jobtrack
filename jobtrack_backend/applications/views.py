from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from rest_framework import viewsets, permissions
from .models import Application, Interview, Task
from .serializers import ApplicationSerializer, InterviewSerializer, TaskSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_resume(self, request, pk=None):
        application = self.get_object()
        application.resume_file = request.FILES.get('resume_file')
        application.save()
        return Response({'resume_file': application.resume_file.url if application.resume_file else None})

class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Interview.objects.filter(application__user=self.request.user).order_by('interview_date')


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('due_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    applications = Application.objects.filter(user=user)

    status_counts = applications.values('status').annotate(count=Count('id'))
    status_dict = {item['status']: item['count'] for item in status_counts}

    upcoming_interviews = Interview.objects.filter(
        application__user=user,
        status='Scheduled'
    ).count()

    pending_tasks = Task.objects.filter(user=user, is_completed=False).count()

    return Response({
        'total_applications': applications.count(),
        'by_status': status_dict,
        'upcoming_interviews': upcoming_interviews,
        'pending_tasks': pending_tasks,
    })