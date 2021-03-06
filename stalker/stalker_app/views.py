# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponseRedirect, HttpResponse

from .forms import RegistrationForm

def home(request):
    return render(request, 'stalker_app/home.html', {})

def login(request):
    return render(request, 'stalker_app/login.html', )

def sign_up(request):
    context = {'registration_form': RegistrationForm()}
    return render(request, 'stalker_app/sign_up.html', context)