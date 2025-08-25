from django.urls import path
from .views import (
    CreateUserAccView,
    LoginUserAccView,
    LogoutUserAccView,
)

urlpatterns = [
    path('users/create/', CreateUserAccView.as_view(), name='create-user'),
    path('users/login/', LoginUserAccView.as_view(), name='login-user'),
    path('users/logout/', LogoutUserAccView.as_view(), name='logout-user'),
]