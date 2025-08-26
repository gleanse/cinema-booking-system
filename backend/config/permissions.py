from rest_framework.permissions import BasePermission

class StaffUserOnly(BasePermission):
    """only authenticated admin users can access"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff

class AllowAny(BasePermission):
    """anyone can access for public endpoints"""
    def has_permission(self, request, view):
        return True
    
class IsSuperUser(BasePermission):
    """only superuser admin only permission"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser