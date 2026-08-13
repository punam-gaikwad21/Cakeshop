from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "password"
        ]

    def validate_username(self, value):

        value = value.strip()

        if User.objects.filter(
            username__iexact=value
        ).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    def validate_email(self, value):

        value = value.strip().lower()

        if User.objects.filter(
            email__iexact=value
        ).exists():
            raise serializers.ValidationError(
                "Email already registered."
            )

        return value

    def create(self, validated_data):

        return User.objects.create_user(
            **validated_data
        )