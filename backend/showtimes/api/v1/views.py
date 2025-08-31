from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.base_views import BaseDetailView
from showtimes.models import Showtime
from .serializers import ShowtimeSerializer, ShowtimeListSerializer, ShowtimeDetailSerializer
from config.permissions import StaffUserOnly, AllowAny
from config.throttles import AdminOperationThrottle, PublicEndpointThrottle

# LIST VIEW
class ShowtimeListView(APIView):
    def get_throttles(self):
        if self.request.method == 'GET':
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [StaffUserOnly()]

    def get(self, request):
        showtimes = Showtime.objects.filter(is_active=True)
        movie_id = request.query_params.get('movie')
        if movie_id:
            showtimes = showtimes.filter(movie_id=movie_id)

        mode = request.query_params.get("detail", "summary").lower()
        
        if mode == "full":
            serializer = ShowtimeDetailSerializer(showtimes, many=True)
        else:
            serializer = ShowtimeListSerializer(showtimes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ShowtimeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DETAIL VIEW
class ShowtimeDetailView(BaseDetailView):
    model = Showtime
    not_found_message = "Showtime not found"
    
    def get_throttles(self):
        if self.request.method == 'GET':
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [StaffUserOnly()]

    def get(self, request, pk):
        showtime = self.get_object(pk)
        mode = request.query_params.get("detail", "summary").lower()
        
        if mode == "full":
            serializer = ShowtimeDetailSerializer(showtime)
        else:
            serializer = ShowtimeSerializer(showtime)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        showtime = self.get_object(pk)
        serializer = ShowtimeSerializer(showtime, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        showtime = self.get_object(pk)
        serializer = ShowtimeSerializer(showtime, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        showtime = self.get_object(pk)
        showtime.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)