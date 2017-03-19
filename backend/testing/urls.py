from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^testing/$', views.test_message),
]