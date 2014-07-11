# -*- coding: utf-8 -*-  
'''
Created on 2014-5-17

@author: mac
'''
from django.http.response import HttpResponse
from django.shortcuts import render
from myuser.models import *
import json
from django.template.context import Context

def index(request):
    context = Context({'type': 1})
    return render(request, 'user/index.html', context)

def register(request):
    context = Context({'type': 2})
    return render(request, 'user/index.html', context)

def findpas(request):
    context = Context({'type': 3})
    return render(request, 'user/index.html', context)

def checkUsername(request):
    _GET = request.GET
    username = _GET.get('username')
    user = MyUser.objects.filter(username = username)
    if user:
        return HttpResponse('false')
    else:
        return HttpResponse('true')
    
def checkEmail(request):
    _GET = request.GET
    email = _GET.get('email')
    user = MyUser.objects.filter(email = email)
    if user:
        return HttpResponse('false')
    else:
        return HttpResponse('true')

def signup(request):
    _POST = request.POST
    username = _POST.get('username')
    email = _POST.get('email')
    password = _POST.get('password')
    results = {'status' : 0}
    if MyUser.objects.filter(username = username).exists():
        results['status'] = 2
    
    if MyUser.objects.filter(email = email).exists():
        results['status'] = 3
    
    if results['status'] == 0:
        user = MyUser.objects.create_user(username, email, password)
        
        if user:
            results['status'] = 0
            #return HttpResponse('0')
        else:
            results['status'] = 1
            #return HttpResponse('1')
        
    return HttpResponse(json.dumps(results), mimetype='application/json')