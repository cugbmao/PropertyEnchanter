# -*- coding: utf-8 -*-  
'''
Created on 2014-5-21

@author: mac
'''
from django.conf.urls import patterns, url
from myuser import views

urlpatterns = patterns('',
                       url(r'^$', views.index, name='index'),
                       url(r'^index$', views.index),
                       url(r'^register$', views.register),
                       url(r'^findpas$', views.findpas),
                       url(r'^checkusername$', views.checkUsername),
                       url(r'^checkemail$', views.checkEmail),
                       url(r'^signup$', views.signup),
)