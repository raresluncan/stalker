""" custom managers for stalker_app models """

from django.contrib.auth.models import BaseUserManager
from django.db.models import Manager


class UserManager(BaseUserManager):
    """ Extends the BaseUserManager class from Django - see docs for more info-

    https://docs.djangoproject.com/en/1.8/_modules/django/contrib/auth/models/

    Implements the create_user and create_superuser based on user's email(not
    the username).
    Sets the fields is_admin, is_active, is_staff according to the user that
    will be created.
    """
    def create_user(self, name, email, address=None, password=None, *args, **kwargs):
        """ specify a name, email, and a password, to create a simple user
        """
        if not email:
            raise ValueError('Email must be set!')
        if not password:
            raise ValueError('Password must be set')
        email = self.normalize_email(email)
        user = self.model(name=name, email=email, address=address, is_admin=False,
                          is_active=True, is_staff=False)
        user.set_password(password)
        user.is_super_admin = False
        user.save(using=self._db)
        return user


    def create_superuser(self, name, email, address=None, password=None, *args, **kwargs):
        """ specify a name, email, and a password, to create a super user
        """
        if not email:
            raise ValueError('Email must be set!')
        if not password:
            raise ValueError('Password must be set')
        email = self.normalize_email(email)
        user = self.model(name=name, email=email, is_admin=True, address=address,
                         is_active=True, is_staff=True)
        user.set_password(password)
        user.is_super_admin = True
        user.save(using=self.db)
        return user

    def get_by_natural_key(self, email):
        """ metod to permit authenticate by email """
        return self.get(**{self.model.USERNAME_FIELD: email})
