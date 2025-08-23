from rest_framework.exceptions import ValidationError
from movies.models import Movie


def validate_limit(limit):
    if not isinstance(limit, int) or limit < 0:
        raise ValidationError({"limit": "Limit must be a non-negative integer"})
    
    if limit > 50:
        raise ValidationError({"limit": "Limit cannot exceed 50"})


# getting list of movies that are active by default but have optional to include also the inactive
# with limits how many movies gonna put in query set
def get_movies(limit=5, include_inactive=False):
    validate_limit(limit)

    if include_inactive:
        queryset = Movie.objects.all()
    else:
        queryset = Movie.objects.filter(is_active=True)
    
    queryset = queryset.order_by("title")[:limit]
    return queryset

# getting list of movies filtered by genre, that are active by default but have optional to include also the inactive
# with limits how many movies gonna put in query set
def get_movies_bygenre(genre_id, limit=5, include_inactive=False):
    validate_limit(limit)

    if include_inactive:
        queryset = Movie.objects.filter(genre_id=genre_id)
    else:
        queryset = Movie.objects.filter(genre_id=genre_id, is_active=True)
    
    queryset = queryset.order_by("title")[:limit]
    return queryset