# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import AbstractBaseUser
from django.db.models import Model, CharField, IntegerField, ForeignKey, \
    BooleanField, DateTimeField, EmailField, DateField, CASCADE, DecimalField
from django.core.validators import EmailValidator, MaxLengthValidator, \
    MinLengthValidator, URLValidator, MaxValueValidator, MinValueValidator
from django.utils import timezone

from . managers import UserManager

class Date(Model):
    """ Abstract class to store common attributes for all 'stalker_app' models.

        Use: Inherit from this class if you want your data timestamped at
        creation and at each update. """

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta():
        abstract = True


class User(AbstractBaseUser, Date):
    """ Model containing all user attributes.Uses 'UserManager' from managers
    """

    objects = UserManager()
    name = CharField(
        max_length=64,
        validators=[
                MaxLengthValidator(100,  message="Name must be at most 100 \
                                   characters"),
                MinLengthValidator(3,   message="Name must be at least 3 \
                                   characters"),
        ])
    email = EmailField(
        max_length=100,
        unique=True,
        validators=[
                MaxLengthValidator(100,  message="Email must be at most 100 \
                                   characters"),
                MinLengthValidator(3,   message="Email must be at least 3 \
                                   characters"),
                EmailValidator(message="Invalid email adress"),
        ],
    )
    address = CharField(
        max_length=100,
        validators=[
                MaxLengthValidator(100,  message="Address must be at most 100 \
                                   characters"),
                MinLengthValidator(3,   message="Address must be at least 3 \
                                   characters"),
        ],
        null=True,
        blank=True,
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

    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            'address': self.address,
            "is_super_admin": self.is_super_admin,
            "is_active": self.is_active,
        }

    class Meta:
        db_table = 'users'


class Coordinate(Date):
    user = ForeignKey(User, on_delete=CASCADE)
    latitude = DecimalField(validators=[
            MaxValueValidator(90,  message="Latitude must be up to 90"),
            MinLengthValidator(-90,   message="Latitude must be a minimum of \
                -90")],
            max_digits=10, decimal_places=8, default=0)
    longitude = DecimalField(validators=[
            MaxValueValidator(180,  message="Longitude must be up to 180"),
            MinLengthValidator(-90,   message="Longitude must be a minimum of \
                -180")],
            max_digits=10, decimal_places=8, default=0)

    class Meta:
        db_table = 'coordinates'