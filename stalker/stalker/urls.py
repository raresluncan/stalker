""" stalker project URL config """

from django.conf.urls import url, include

urlpatterns = [
    url(r'^', include('stalker_app.urls')),
    url(r'^', include('stalker_app_api.urls')),
]