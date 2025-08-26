from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

class PublicEndpointThrottle(AnonRateThrottle):
    """for public API calls endpoints limitations"""
    scope = 'public'

class AdminOperationThrottle(UserRateThrottle):
    """for admin API calls endpoints limitations"""
    scope = 'admin'

class LoginRateThrottle(AnonRateThrottle):
    """for login rate attempts limits"""
    scope = 'login'