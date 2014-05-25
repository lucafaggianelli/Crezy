from django.conf.urls import patterns, url
from presentations import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [ #patterns('',
    url(r'^$', views.index, name="index"),
    url(r'^(?P<presentation_id>\d+)/$', views.detail, name='detail'),
    url(r'^(?P<presentation_id>\d+)/play$', views.play, name='play'),
    url(r'^(?P<presentation_id>\d+)/edit$', views.edit, name='edit'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
