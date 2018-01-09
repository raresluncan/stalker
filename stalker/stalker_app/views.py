# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.conf import settings
from django.urls import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required, user_passes_test

from stalker_app_api.forms import RegistrationForm
from .helper_functions import is_super_admin

def home(request):
    return render(request, 'stalker_app/home.html', {})

def login(request):
    context = {'login_api': reverse('stalker_app_api:auth_login')}
    if request.user.is_authenticated():
        return HttpResponseRedirect('stalker_app/home.html')
    return render(request, 'stalker_app/login.html', context)

def sign_up(request):
    context = {
        'registration_form': RegistrationForm(),
        'sign_up_url': reverse('stalker_app_api:sign_up_attempt'),
    }
    return render(request, 'stalker_app/sign_up.html', context)

def maps(request):
    context = {
        'map_api_key': settings.MAPS_API_KEY,
        'mark_location_api': reverse('stalker_app_api:mark_location'),
        'get_locations_api': reverse('stalker_app_api:get_locations_for_user'),
    }
    return render(request, 'stalker_app/maps.html', context)