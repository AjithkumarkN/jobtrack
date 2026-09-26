import re
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    username = serializers.CharField(min_length=3, max_length=150)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ('username', 'email', 'profile_photo', 'phone', 'location', 'professional_title',
                   'skills', 'experience', 'education', 'linkedin_url', 'github_url', 'portfolio_url', 'resume')

    def validate_phone(self, value):
        if value and not re.match(r'^\+?\d{10,15}$', value):
            raise serializers.ValidationError("Enter a valid phone number (10-15 digits, optional + prefix).")
        return value

    def validate_profile_photo(self, value):
        if value and hasattr(value, 'size'):
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError("Profile photo must be under 2MB.")
            if value.content_type not in ['image/jpeg', 'image/png']:
                raise serializers.ValidationError("Only JPG and PNG images are allowed.")
        return value

    def validate_resume(self, value):
        if value and hasattr(value, 'size'):
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Resume must be under 5MB.")
            allowed_extensions = ['.pdf', '.doc', '.docx']
            if not any(value.name.lower().endswith(ext) for ext in allowed_extensions):
                raise serializers.ValidationError("Resume must be a PDF, DOC, or DOCX file.")
        return value