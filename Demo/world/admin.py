from django.contrib.gis import admin
# from models import WorldBorders
from models import AustModel

# Register your models here.
# admin.site.register(WorldBorders, admin.GeoModelAdmin)
admin.site.register(AustModel, admin.GeoModelAdmin)