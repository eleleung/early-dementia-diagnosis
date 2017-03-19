from django.db import models

# Create your models here.
class Test(models.Model):
    message = models.CharField(max_length=100, blank=True, default='')