from django.conf.urls import url

from . import views

app_name = 'stalker_app_api'

urlpatterns = [
    url(r'^auth_login/$', views.auth_login, name='auth_login'),
    url(r'^auth_logout/$', views.auth_logout, name='auth_logout'),
    url(r'^sign_up_attempt/$', views.sign_up_attempt, name='sign_up_attempt'),
    url(r'^mark_location/$', views.mark_location, name='mark_location'),
    url(r'^locations/$', views.get_locations_for_user, name='get_locations_for_user'),
    url(r'^get_users/$', views.get_users, name='get_users'),
    url(r'^change_user_admin/$', views.change_user_admin, name='change_user_admin'),
    url(r'^new_user/$', views.new_user, name='new_user'),
]