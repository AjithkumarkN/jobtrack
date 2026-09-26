from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, delete_account, ProfileView
from .views import RegisterView, delete_account, ProfileView, clear_profile

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('delete-account/', delete_account, name='delete_account'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/clear/', clear_profile, name='clear_profile'),
]