# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, QueryDict, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect
from django.core import serializers
from django.db.models.functions import Lower

from stalker_app_api.validators import validate_email_address
from .forms import RegistrationForm
from .models import User, Coordinate

@csrf_protect
@require_http_methods(["POST"])
def auth_login(request):
    if User.objects.filter(is_super_admin=True).count() == 0:
        User.objects.create_superuser(
            email='admin@yahoo.com',
            password='admin',
            address='Cluj-Napoca, Cluj',
            name='Rares Luncan'
        )
    if request.user.is_authenticated():
        return JsonResponse({"success": True})

    data = QueryDict(request.body)

    if not validate_email_address(data['email']):
        return JsonResponse({
            "success": False,
            'errors': {'email': 'Invalid email address!'}
        }, status=500)

    email = data['email']
    password = data['password']
    user = authenticate(request, email=email, password=password)
    if not user:
        return JsonResponse({
            "success": False,
            "errors": {'login': 'Invalid email or password!'}
        }, status=500)

    login(request, user)

    return JsonResponse({"success": True})

@login_required
@csrf_protect
def auth_logout(request):
    logout(request)
    return JsonResponse({"success": True})


@require_http_methods(["POST"])
@csrf_protect
def sign_up_attempt(request):
    registration_form = RegistrationForm(QueryDict(request.body))
    if registration_form.is_valid():
        try:
            new_user = User.objects.create_user(**registration_form.cleaned_data)
        except (User.IntegrityError):
            return JsonResponse({
                "success": False,
                'errors': json.dumps(registration_form.errors),
            }, safe=False, status=500)
        return JsonResponse(json.dumps({
            'success': True,
            'user_object': new_user.to_dict(),
        }), safe=False)
    return JsonResponse({
        "success": False,
        'errors': json.dumps(registration_form.errors),
    }, safe=False, status=500)

@require_http_methods(["POST"])
@csrf_protect
def new_user(request):
    registration_form = RegistrationFormAdmin(QueryDict(request.body))
    iif registration_form.is_valid():
        try:
            import pdb; pdb.set_trace()
            new_user = User.objects.create_user(**registration_form.cleaned_data)
        except (User.IntegrityError):
            return JsonResponse({
                "success": False,
                'errors': json.dumps(registration_form.errors),
            }, safe=False, status=500)
        return JsonResponse(json.dumps({
            'success': True,
            'user_object': new_user.to_dict(),
        }), safe=False)
    return JsonResponse({
        "success": False,
        'errors': json.dumps(registration_form.errors),
    }, safe=False, status=500)

@require_http_methods(["POST"])
@login_required
@csrf_protect
def mark_location(request):
    data = json.loads(request.body)
    new_coordinate = Coordinate.objects.create(
        latitude=data['lat'],
        longitude=data['lng'],
        user=request.user
    )
    return JsonResponse({'Success': True})

@require_http_methods(["GET"])
@login_required
@csrf_protect
def get_locations_for_user(request):
    user = request.user
    coordinates = Coordinate.objects.filter(user=user).defer('id').defer('user')
    if request.GET.get('user_id', None):
        user_id = int(json.loads(request.GET.get('user_id'))[0])
        user = User.objects.get(id=user_id)
        coordinates = Coordinate.objects.filter(user=user).defer('id').defer('user')
    data = {
        'user': user.to_dict(),
        'data': serializers.serialize('json', coordinates),
    }
    return HttpResponse(json.dumps(data), content_type="application/json")

@require_http_methods(["GET"])
@login_required
@csrf_protect
def get_users(request):
    users = User.objects.order_by(Lower('name'));
    data = serializers.serialize('json', users)
    return HttpResponse(data, content_type="application/json")


@require_http_methods(["POST"])
@login_required
@csrf_protect
def change_user_admin(request):
    if QueryDict(request.body).get('user_id', None) is None:
        return JsonResponse({
            'success': False,
            'message': 'No user id was sent with the request or it is None'
        }, status=500)
    user_id = int(QueryDict(request.body).get('user_id'))
    user = User.objects.get(id=user_id)
    user.is_super_admin = not user.is_super_admin
    user.save()
    return JsonResponse({'success': True}, status=200)