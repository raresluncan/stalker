from django.conf.urls import url

from . import views

app_name = 'stalker_app'

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^login/$', views.login, name='login'),
]