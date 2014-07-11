from django.conf.urls import patterns, include, url
from django.contrib.gis import admin
import settings
from world.views import index
# from user.views import index as userindex, checkUsername, checkEmail, signup


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Demo.views.home', name='home'),
    # url(r'^Demo/', include('Demo.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^$', index),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.STATIC_ROOT }),  
    
    url(r'^world/', include('world.urls')),
    url(r'^user/', include('myuser.urls')),
#     url(r'^$', userindex),
#     url(r'^user/index$', userindex),
#     url(r'^user/checkusername$', checkUsername),
#     url(r'^user/checkemail$', checkEmail),
#     url(r'^user/signup$', signup),
)
