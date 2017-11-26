""" Models in stalker_app """
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models import CharField, IntegerField, ForeignKey, \
    BooleanField, DateTimeField, EmailField, DateField, CASCADE, SET_NULL
from django.core.validators import EmailValidator, MaxLengthValidator, \
    MinLengthValidator, URLValidator, MaxValueValidator, MinValueValidator
from django.utils import timezone

class Date(Model):
    """ Abstract class to store common attributes for all 'stalker_app' models.

        Use: Inherit from this class if you want your data timestamped at
        creation and at each update. """

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta():
        abstract = True


class User(models.AbstractBaseUser, Date):
    """ Model containing all user attributes.Uses 'UserManager' from managers
    """

    objects = UserManager()
    name = CharField(
        max_length=64,
        validators=[
                MaxLengthValidator(64,  message="Name must be at most 64 \
                                   characters"),
                MinLengthValidator(3,   message="Name must be at least 3 \
                                   characters"),
        ])
    email = EmailField(
        max_length=100,
        unique=True,
        validators=[
                MaxLengthValidator(100,  message="Email must be at most 64 \
                                   characters"),
                MinLengthValidator(3,   message="Email must be at least 3 \
                                   characters"),
                EmailValidator(message="Invalid email adress"),
        ],
    )
    password = CharField(max_length=1000)
    is_super_admin = BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'is_super_admin']

    date_joined = DateTimeField(default=timezone.now)
    is_active = BooleanField(default=True)
    is_admin = BooleanField(default=False)
    is_staff = BooleanField(default=False)


    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

    class Meta:
        db_table = 'users'