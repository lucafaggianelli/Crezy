from django.conf.urls import patterns, url
from presentations import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [ #patterns('',
    url(r'^$', views.index, name="index"),
    url(r'^(?P<presentation_id>\d+)/$', views.detail, name='detail'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
