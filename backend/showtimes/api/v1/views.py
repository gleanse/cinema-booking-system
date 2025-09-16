from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.base_views import BaseDetailView
from showtimes.models import Showtime, Cinema, ScreeningRoom
from .serializers import (
    ShowtimeSerializer, 
    ShowtimeListSerializer, 
    ShowtimeDetailSerializer, 
    CinemaSerializer, 
    CinemaDetailSerializer,
    ScreeningRoomSerializer
)
from config.permissions import StaffUserOnly, AllowAny
from config.throttles import AdminOperationThrottle, PublicEndpointThrottle

# SHOWTIME VIEWS
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
    
# CINEMA VIEWS
class CinemaListView(APIView):
    def get_throttles(self):
        if self.request.method == "GET":
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [StaffUserOnly()]

    def get(self, request):
        cinemas = Cinema.objects.all()
        mode = request.query_params.get("detail", "summary").lower()

        if mode == "full":
            serializer = CinemaDetailSerializer(cinemas, many=True)
        else:
            serializer = CinemaSerializer(cinemas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CinemaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CinemaDetailView(BaseDetailView):
    model = Cinema
    not_found_message = "Cinema not found"

    def get_throttles(self):
        if self.request.method == "GET":
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [StaffUserOnly()]

    def get(self, request, pk):
        cinema = self.get_object(pk)
        mode = request.query_params.get("detail", "summary").lower()

        if mode == "full":
            serializer = CinemaDetailSerializer(cinema)
        else:
            serializer = CinemaSerializer(cinema)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        cinema = self.get_object(pk)
        serializer = CinemaSerializer(cinema, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        cinema = self.get_object(pk)
        serializer = CinemaSerializer(cinema, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cinema = self.get_object(pk)
        cinema.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CinemaShowtimesView(BaseDetailView):
    model = Cinema
    not_found_message = "Cinema not found"

    def get_throttles(self):
        return [PublicEndpointThrottle()]
    
    def get_permissions(self):
        return [AllowAny()]
    
    def get(self, request, cinema_id):
        cinema = self.get_object(cinema_id)
        
        showtimes = Showtime.objects.filter(
            room__cinema=cinema, 
            is_active=True
        ).select_related('room', 'movie').order_by('show_date', 'show_time')

        date_filter = request.query_params.get('date')
        if date_filter:
            showtimes = showtimes.filter(show_date=date_filter)

        movie_id = request.query_params.get('movie')
        if movie_id:
            showtimes = showtimes.filter(movie_id=movie_id)
        
        serializer = ShowtimeDetailSerializer(showtimes, many=True)
        
        response_data = {
            'cinema': {
                'id': cinema.id,
                'name': cinema.name,
                'location': cinema.location
            },
            'showtimes': serializer.data
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

# SCREENING ROOM VIEWS
class ScreeningRoomListView(APIView):
    def get_throttles(self):
        if self.request.method == "GET":
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [StaffUserOnly()]

    def get(self, request):
        rooms = ScreeningRoom.objects.all()
        serializer = ScreeningRoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ScreeningRoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScreeningRoomDetailView(BaseDetailView):
    model = ScreeningRoom
    not_found_message = "Screening room not found"

    def get_throttles(self):
        if self.request.method == "GET":
            return [PublicEndpointThrottle()]
        return [AdminOperationThrottle()]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [StaffUserOnly()]

    def get(self, request, pk):
        room = self.get_object(pk)
        serializer = ScreeningRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        room = self.get_object(pk)
        serializer = ScreeningRoomSerializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        room = self.get_object(pk)
        serializer = ScreeningRoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        room = self.get_object(pk)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)