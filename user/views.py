from django.shortcuts import render

# Create your views here.
def connexion_enregistrement(request):
    return render(request,"user/connect_register.html")

def profil_user(request):
    return render(request,"user/user_profil.html")