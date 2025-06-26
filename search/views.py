# app_culturelle/views.py
from django.shortcuts import render
from django.http import HttpResponse # Si vous en avez besoin pour d'autres vues
from .services.ai_cultural_service import get_cultural_info_from_gemini # Importez votre fonction de service

def cultural_info_view(request):
    """
    Vue pour interagir avec le service d'IA et obtenir des informations culturelles.
    """
    cultural_explanation = None # Variable pour stocker la réponse de l'IA
    user_query = None           # Variable pour stocker la requête de l'utilisateur

    if request.method == 'POST':
        # Si le formulaire est soumis (méthode POST)
        user_query = request.POST.get('user_query_text') # Récupérez la requête de l'utilisateur depuis le formulaire
        if user_query: # Si la requête n'est pas vide
            # Appelle le service AI pour obtenir l'information
            cultural_explanation = get_cultural_info_from_gemini(user_query)
        else:
            cultural_explanation = "Veuillez entrer une question pour obtenir une information culturelle."

    # Rend le template, en passant la réponse de l'IA et la requête de l'utilisateur
    return render(request, 'search/cultural_info.html', {
        'cultural_explanation': cultural_explanation,
        'user_query': user_query
    })