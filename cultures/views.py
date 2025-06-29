from django.shortcuts import render

# Create your views here.
def accueil(request):
    return render(request,"cultures/index.html")