from django.conf.urls import patterns, url
from world import views

urlpatterns = patterns('',
                       url(r'^$', views.index, name='index'),
                       url(r'^index/', views.index),
                       url(r'^query$', views.query),
)