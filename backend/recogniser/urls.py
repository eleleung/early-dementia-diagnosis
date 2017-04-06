from django.conf.urls import url
from .views import TranscribeAudio

urlpatterns = [
    url(r'^transcribe/(?P<file_name>[\w.]{0,256})/$', TranscribeAudio.as_view()),
]

