from django.urls import path
from .views import (
    CreateUserAccView,
    LoginUserAccView,
    LogoutUserAccView,
    CurrentUserView,
    UserListView,
    UserDetailView,
    UserUpdateView,
    UserDeleteView,
    UserToggleActiveView,
    UserSelfUpdateView
)

urlpatterns = [
    path('users/create/', CreateUserAccView.as_view(), name='create-user'),
    path('users/login/', LoginUserAccView.as_view(), name='login-user'),
    path('users/logout/', LogoutUserAccView.as_view(), name='logout-user'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<int:user_id>/update/', UserUpdateView.as_view(), name='user-update'),
    path('users/<int:user_id>/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('users/<int:user_id>/toggle-active/', UserToggleActiveView.as_view(), name='user-toggle-active'),
    path('users/me/update/', UserSelfUpdateView.as_view(), name='user-self-update'),
]