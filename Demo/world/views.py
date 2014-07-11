from django.contrib.gis.db.models.fields import MultiPolygonField
from django.forms.models import model_to_dict
from django.http.response import HttpResponse
from django.shortcuts import render
from world.models import *
import decimal
import json
from django.contrib.gis.geos.geometry import GEOSGeometry

# Create your views here.

def decimal_default(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)

def index(request):
    return render(request, 'world/index.html')

def query(request):
    lat = request.GET.get('lat')
    lng = request.GET.get('lon')
    
    point = 'POINT('+lng+' '+lat+')'
    
    results = {'status': 'success'}
    
    gpieces = AustModel.objects.filter(geom__contains=point)
    if(len(gpieces)>0):
        results['count'] = 1
        results['piece'] = model_to_dict(gpieces[0])
        wkt = gpieces[0].geom.wkt
        #g = GEOSGeometry(wkt, srid=4326)
        #g.transform(900913)
        results['piece']['geom'] = wkt
        rid = gpieces[0].sa1_7digit
        population = PopulationModel.objects.get(regionid=rid)
        results['population'] = model_to_dict(population)
        median = MedianModel.objects.get(regionid=rid)
        results['median'] = model_to_dict(median)
        family = FamilyModel.objects.get(regionid=rid)
        results['family'] = model_to_dict(family)
        vehiclesperdwelling = VehiclesperdwellingModel.objects.get(regionid=rid)
        results['vehiclesperdwelling'] = model_to_dict(vehiclesperdwelling)
    else:
        results['count'] = 0
    
    return HttpResponse(json.dumps(results, default=decimal_default))