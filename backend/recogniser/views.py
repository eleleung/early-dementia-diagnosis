from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from recogniser.textanalyser import transcribe_audio

class TranscribeAudio(APIView):
    permission_classes = (AllowAny,)
    def post(self, request, file_name):
        return Response(transcribe_audio(file_name))