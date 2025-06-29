from django.urls import path

from . import views

urlpatterns=[path('api/regions/', views.get_regions, name='api_regions'),
             path('api/departments/', views.get_departments_by_region, name='api_departments_by_region'),
             ]