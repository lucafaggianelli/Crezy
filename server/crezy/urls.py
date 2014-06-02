from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # url(r'^$', 'crezy.views.home', name='home'),
    ('^accounts/', include('django.contrib.auth.urls')),
    # url(r'^blog/', include('blog.urls')),

    #url(r'?users/', include('users.urls')),
    url(r'^presentations/', include('presentations.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
