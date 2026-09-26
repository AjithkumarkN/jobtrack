from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, ProfileSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response({'message': 'Account deleted successfully'}, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user.profile

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_profile(request):
    profile = request.user.profile
    if profile.profile_photo:
        profile.profile_photo.delete(save=False)
    if profile.resume:
        profile.resume.delete(save=False)
    profile.phone = ''
    profile.location = ''
    profile.professional_title = ''
    profile.skills = ''
    profile.experience = ''
    profile.education = ''
    profile.linkedin_url = ''
    profile.github_url = ''
    profile.portfolio_url = ''
    profile.save()
    return Response({'message': 'Profile data cleared'})