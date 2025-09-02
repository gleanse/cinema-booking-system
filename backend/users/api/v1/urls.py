from django.urls import path
from .views import (
    CreateUserAccView,
    LoginUserAccView,
    LogoutUserAccView,
    CurrentUserView,
)

urlpatterns = [
    path('users/create/', CreateUserAccView.as_view(), name='create-user'),
    path('users/login/', LoginUserAccView.as_view(), name='login-user'),
    path('users/logout/', LogoutUserAccView.as_view(), name='logout-user'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
]