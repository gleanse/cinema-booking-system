from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

class BaseDetailView(APIView):
    model = None
    not_found_message = "Object not found"
    
    def get_object(self, pk):
        try:
            return self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            raise NotFound(detail=self.not_found_message)