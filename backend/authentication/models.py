from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid e-mail address')

        user = self.model(
            email=self.normalize_email(email),
            firstname=kwargs.get('firstname', None),
            lastname=kwargs.get('lastname', None),
            date_of_birth=kwargs.get('date_of_birth', None)
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, **kwargs):
        account = self.create_user(email, password)

        account.is_admin = True
        account.save()

        return account


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)

    firstname = models.CharField(max_length=100, blank=True, null=True)
    lastname = models.CharField(max_length=100, blank=True, null=True)

    date_of_birth = models.DateTimeField(null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Patient(models.Model):
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)

    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    # need DateTimeField
    date_of_birth = models.DateField()

    carers = models.ManyToManyField(User, blank=True)

