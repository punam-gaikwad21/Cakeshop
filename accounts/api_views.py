from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer

from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated

from django.utils.decorators import method_decorator

from django.contrib.auth import authenticate, login, logout


class RegisterAPIView(APIView):

    authentication_classes = []
    permission_classes = []


    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )


        if serializer.is_valid():

            serializer.save()

            return Response({
                "message":"Registration Successful"
            })


        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )





class LoginAPIView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:

            return Response({
                "success": False,
                "error": "Username and password are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:

            return Response({
                "success": False,
                "error": "Invalid Login"
            }, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)

        refresh = RefreshToken.for_user(user)

        if user.is_staff or user.is_superuser:

            redirect_url = "/admin_dashboard/"

        else:

            redirect_url = "/"

        return Response({

            "success": True,

            "access": str(
                refresh.access_token
            ),

            "refresh": str(refresh),

            "redirect": redirect_url

        })

class LogoutAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        refresh_token = request.data.get("refresh")

        if not refresh_token:

            return Response({
                "success": False,
                "message": "Refresh token is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:

            token = RefreshToken(
                refresh_token
            )

            token.blacklist()

            logout(request)

            return Response({
                "success": True,
                "message": "Logout successful"
            })

        except Exception:

            logout(request)

            return Response({
                "success": False,
                "message": "Invalid refresh token."
            }, status=status.HTTP_400_BAD_REQUEST)