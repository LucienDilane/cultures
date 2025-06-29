from django.urls import path

from . import views

urlpatterns=[
    path('',views.connexion_inregistrement,name='accueil'),
]
