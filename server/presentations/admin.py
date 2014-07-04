from django.contrib import admin
from presentations.models import Presentation

class PresentationAdmin(admin.ModelAdmin):
    pass

admin.site.register(Presentation, PresentationAdmin)
