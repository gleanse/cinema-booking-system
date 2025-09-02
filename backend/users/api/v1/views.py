from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from users.api.v1.serializers import UserCreateSerializer, UserSerializer
from config.permissions import IsSuperUser, AllowAny
from config.throttles import LoginRateThrottle


class CreateUserAccView(APIView):
    permission_classes = [IsSuperUser]

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, is_created = Token.objects.get_or_create(user=user)
            return Response({
                'user': serializer.data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUserAccView(APIView):
    throttle_classes = [LoginRateThrottle]
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            token, is_created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'new': is_created}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutUserAccView(APIView):
    permission_classes = [IsAuthenticated]

    # NOTE:
    # currently  logout do is deleting the token after user logging out making the first created token revoked which is good for security but if the user login on two different device and then it logged out on other device the other device is sharing the same token so it should be logged out too since the current token it has is already revoked need to relogin inorder to do api calls for now this is fine but ill fixed this later
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({'error': 'Token not found'}, status=status.HTTP_400_BAD_REQUEST)
        
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)