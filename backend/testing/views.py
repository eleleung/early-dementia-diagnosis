from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from testing.serializers import TestSerializer
from testing.models import Test

from rest_framework import viewsets

class TestViewSet(viewsets.ModelViewSet):
    serializer_class = TestSerializer

@csrf_exempt
def test_message(request):
    if request.method == 'GET':
        test = Test(message='hello all')
        serializer = TestSerializer(test)
        return JsonResponse(serializer.data, safe=True)