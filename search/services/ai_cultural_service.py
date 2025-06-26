# app_culturelle/services/ai_cultural_service.py
import google.generativeai as genai
from django.conf import settings # Pour accéder à GOOGLE_API_KEY depuis settings.py

def configure_gemini():
    """Configure l'API Gemini avec la clé API."""
    api_key = settings.GOOGLE_API_KEY
    if not api_key:
        raise ValueError("La clé GOOGLE_API_KEY n'est pas configurée dans les paramètres de Django.")
    genai.configure(api_key=api_key)

def get_cultural_info_from_gemini(query):
    """
    Interroge l'API Gemini pour obtenir des informations sur un sujet culturel.
    """
    configure_gemini() # Configure l'API à chaque appel pour s'assurer que la clé est bien chargée.

    try:
        # Choisissez le modèle approprié. 'gemini-pro' est un bon équilibre performance/coût.
        model = genai.GenerativeModel('gemini-2.5-flash')

        # Définissez le rôle du modèle et la requête utilisateur
        # C'est ce qu'on appelle le "prompt engineering" : bien formuler la question
        prompt = (
            f"En tant qu'expert en cultures africaines et camerounaises, "
            f"fournis des faits culturels, des explications sur les origines des peuples, ethnies, "
            f"ou des cultures spécifiques. Concentre-toi sur des informations précises et factuelles. "
            f"Réponds en français. Le sujet est : {query}"
        )

        response = model.generate_content(prompt)

        # Vérifiez si la réponse contient du texte et renvoyez-le
        if response and response.text:
            return response.text
        else:
            return "Désolé, l'IA n'a pas pu générer d'information pertinente pour cette requête."


    except Exception as e:
        # Gérer toute autre erreur inattendue
        print(f"Une erreur inattendue est survenue: {e}")
        return f"Désolé, une erreur inattendue est survenue: {e}"

# Exemple d'utilisation (peut être supprimé ou commenté après le test)
"""if __name__ == '__main__':
    # Ce bloc s'exécute uniquement si le fichier est exécuté directement, pas importé
    # Cela peut être utile pour des tests rapides en ligne de commande
    # Assurez-vous d'avoir une clé GOOGLE_API_KEY configurée dans votre environnement si vous testez ici
    # (Dans un vrai projet Django, cette partie sera appelée par les vues)
    print("Test de la fonction get_cultural_info_from_gemini :")
    info = get_cultural_info_from_gemini("Origine du peuple Bamiléké au Cameroun")
    print(info)
    print("n---")
    info2 = get_cultural_info_from_gemini("Importance du Njang à l'Ouest Cameroun")
    print(info2)"""