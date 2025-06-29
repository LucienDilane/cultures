from django.urls import path

from . import views
import user.views as user
import region.views as reg
import search.views as ia

urlpatterns=[
    path('',views.accueil,name='accueil'),

    #Gestion des utilisateurs
    path('connexion',user.connexion_enregistrement,name='connect'),
    path('profil',user.profil_user,name='profil_user'),

    #Recherche IA
    path('culture_ia/',ia.cultural_info_view,name='search'),
]
