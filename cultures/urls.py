from django.urls import path
import search.views as ia

urlpatterns=[
    path('culture_ia/',ia.cultural_info_view,name='search'),
]
