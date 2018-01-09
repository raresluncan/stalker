""" all the forms in 'app' application """

import datetime
from django.utils import timezone
from django.forms import Form, ModelForm, CharField, TextInput, PasswordInput, \
    EmailField, BooleanField, Textarea, CheckboxInput, URLField, ChoiceField, \
    MultipleChoiceField, DateTimeField, HiddenInput
from django.core.validators import EmailValidator, MaxLengthValidator, \
    MinLengthValidator

from stalker_app_api.models import User

class BaseUserForm(ModelForm):
    """ form used to edit a specifc user object or create a new one """

    class Meta:
        model = User
        fields = ('name', 'email', 'address')
        widgets =  {
            'name': TextInput(attrs={'class': 'form-control required', 'placeholder': 'Name'}),
            'email': TextInput(attrs={'class': 'form-control required', 'placeholder': 'Email'}),
            'address': TextInput(attrs={'class': 'form-control', 'placeholder': 'Address'}),
        }
        labels = {
            'name': 'Name:',
            'email': 'Email:',
            'address': 'Address',
        }
        error_messages = {
            'name': {
                'max_length': "Name must be at most 64 characters",
                'min_length': "Name must be at least 3 characters",
            },
            'description': {
                'max_length': "Email must be at most 64 characters",
                'min_length': "Email must be at least 3 characters",
            },
        }


class RegistrationForm(BaseUserForm):
    """ extends the BaseUserForm to create a for for adding a new_user.If form
        doesn't raise errors a new user is saved """

    password = CharField(
        label='Password:',
        widget=PasswordInput(
            attrs={
               'class': 'form-control required',
               'id': 'login-password',
               'placeholder': 'Password',
            }
        ),
        validators=[
            MaxLengthValidator(
                  64,
                  message="Password must be at most 64 characters"
            ),
            MinLengthValidator(
                5,
                message="Password must be at least 5 characters long"
            )
        ]
    )

    confirm_password = CharField(
        label='Confirm password:',
        widget=PasswordInput(
            attrs={
               'class': 'form-control required',
               'placeholder': 'Confirm Password',
            }
        ),
    )
    def clean(self):
        """ method to add a custom error to the form if the data from the
            password field does't match confirm password field data """
        cleaned_data = super(RegistrationForm, self).clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password != confirm_password:
            self.add_error('confirm_password', "Passwords don't match")

        return cleaned_data