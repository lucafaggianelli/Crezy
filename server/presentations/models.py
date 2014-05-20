from django.db import models
from django.contrib.auth.models import User

class Presentation(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=300)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __unicode__(self):
        return self.title
