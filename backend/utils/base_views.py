from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

class BaseDetailView(APIView):
    model = None
    not_found_message = "Object not found"
    select_related_fields = None
    prefetch_related_fields = None
    
    def get_object(self, pk):
        try:
            queryset = self.model.objects
            
            if self.select_related_fields:
                queryset = queryset.select_related(*self.select_related_fields)
            
            if self.prefetch_related_fields:
                queryset = queryset.prefetch_related(*self.prefetch_related_fields)
                
            return queryset.get(pk=pk)
        except self.model.DoesNotExist:
            raise NotFound(detail=self.not_found_message)
        except Exception as e:
            return self.model.objects.get(pk=pk)