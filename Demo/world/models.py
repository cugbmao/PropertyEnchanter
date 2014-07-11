# -*- coding: utf-8 -*

from django.contrib.gis.db import models

# Create your models here.

# class WorldBorders(models.Model):
#     # 基于世界地图shapefile文件中的属性字段而构建的Django字段
#     name = models.CharField(max_length=50)
#     area = models.IntegerField()
#     pop2005 = models.IntegerField('Population 2005')
#     fips = models.CharField('FIPS Code', max_length=2)
#     iso2 = models.CharField('2 Digit ISO', max_length=2)
#     iso3 = models.CharField('3 Digit ISO', max_length=3)
#     un = models.IntegerField('United Nations Code')
#     region = models.IntegerField('Region Code')
#     subregion = models.IntegerField('Sub-Region Code')
#     lon = models.FloatField()
#     lat = models.FloatField()
#     # GeoDjango制定的一个地理几何字段 (MultiPolygonField),
#     # 并用GeoManager实例覆盖默认的管理器。
#     mpoly = models.MultiPolygonField()
#     objects = models.GeoManager()
#  
#     class Meta:
#         # 制定复数名.
#         verbose_name_plural = "World Borders"
#  
#     # 返回表达模型的字符串。
#     def __unicode__(self):
#         return self.name
    
class AustModel(models.Model):
#     gid = models.IntegerField()
    sa1_7digit = models.CharField(max_length=7)
    state_code = models.CharField(max_length=1)
    state_name = models.CharField(max_length=50)
    area_sqkm = models.FloatField()
    geom = models.MultiPolygonField(srid=4326)
    
    objects = models.GeoManager()
    
    class Meta:
        db_table = 'sa1_2011_aust'
        
    # 返回表达模型的字符串。
    def __unicode__(self):
        return self.state_name
    
class PopulationModel(models.Model):
    regionid = models.IntegerField(primary_key=True)
    tot_p_m = models.IntegerField()
    tot_p_f = models.IntegerField()
    tot_p = models.IntegerField()
    
    class Meta:
        db_table = 'b01_2011_vic_sa1_population'
        
class MedianModel(models.Model):
    regionid = models.IntegerField(primary_key=True)
    median_age = models.IntegerField()
    median_mortgage = models.IntegerField()
    median_total_per_income = models.IntegerField()
    median_rent = models.IntegerField()
    median_family_income = models.IntegerField()
    average_num_per_bedroom = models.FloatField()
    median_total_household_income = models.IntegerField()
    average_household_size = models.FloatField()
    
    class Meta:
        db_table= 'b02_2011_vic_sa1_medians'
        
class FamilyModel(models.Model):
    regionid = models.IntegerField(primary_key=True)
    cf_no_children_f = models.IntegerField()
    cf_no_children_p = models.IntegerField()
    cf_children_f = models.IntegerField()
    cf_children_p = models.IntegerField()
    opf_total_f = models.IntegerField()
    opf_total_p = models.IntegerField()
    other_f_f = models.IntegerField()
    other_f_p = models.IntegerField()
    tot_f = models.IntegerField()
    tot_p = models.IntegerField()
    
    class Meta:
        db_table = 'b25_2011_vic_sa1_family'
        
class VehiclesperdwellingModel(models.Model):
    regionid = models.IntegerField(primary_key=True)
    num_mvs_0 = models.IntegerField()
    num_mvs_1 = models.IntegerField()
    num_mvs_2 = models.IntegerField()
    num_mvs_3 = models.IntegerField()
    num_mvs_4mo = models.IntegerField()
    num_mvs_total = models.IntegerField()
    num_mvs_ns = models.IntegerField()
    tot_dweling = models.IntegerField()
    
    class Meta:
        db_table = 'b29_2011_vic_sa1_vehiclesperdweling'