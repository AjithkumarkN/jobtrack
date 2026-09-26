from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, InterviewViewSet, TaskViewSet, dashboard_stats

router = DefaultRouter()
router.register('applications', ApplicationViewSet, basename='application')
router.register('interviews', InterviewViewSet, basename='interview')
router.register('tasks', TaskViewSet, basename='task')

urlpatterns = router.urls + [
    path('dashboard/stats/', dashboard_stats),
]