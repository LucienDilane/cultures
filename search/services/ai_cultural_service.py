# app_culturelle/services/ai_cultural_service.py
import google.generativeai as genai
from django.conf import settings # Pour accéder à GOOGLE_API_KEY depuis settings.py
from langdetect import detect, DetectorFactory # Importez les outils de détection de langue

# Important : Configurez la graine pour la reproductibilité de langdetect
DetectorFactory.seed = 0

def configure_gemini():
    """Configure l'API Gemini avec la clé API."""
    api_key = settings.GOOGLE_API_KEY
    if not api_key:
        raise ValueError("La clé GOOGLE_API_KEY n'est pas configurée dans les paramètres de Django.")
    genai.configure(api_key=api_key)

def get_input_language(text: str) -> str:
    """
    Détecte la langue d'un texte. Retourne 'fr' pour le français, 'en' pour l'anglais.
    Retourne 'en' par défaut pour les textes très courts ou non reconnus, car "Hello" est en anglais.
    """
    text = text.strip()
    if not text: # Si le texte est vide
        return 'en' # Langue par défaut

    try:
        detected_lang = detect(text)
        if detected_lang == 'fr':
            return 'fr'
        # Pour tout le reste (y compris 'en', et les détections potentiellement erronées comme 'fi'),
        # nous considérons que c'est de l'anglais dans notre contexte F/EN.
        else:
            return 'en'
    except Exception:
        # En cas d'erreur de détection (par exemple, texte trop court ou inintelligible)
        return 'en' # Langue par défaut en cas d'échec de détection

def get_cultural_info_from_gemini(query):
    """
    Interroge l'API Gemini pour obtenir des informations sur un sujet culturel,
    en adaptant la langue de la réponse à celle de la question.
    """
    configure_gemini() # Configure l'API à chaque appel pour s'assurer que la clé est bien chargée.

    try:
        # Détecte la langue de la question de l'utilisateur
        input_lang = get_input_language(query)

        # Définissez l'instruction de langue pour Gemini en fonction de la détection
        language_instruction = ""
        if input_lang == 'fr':
            language_instruction = "Réponds en français."
        else: # input_lang == 'en'
            language_instruction = "Answer in English."

        # Choisissez le modèle approprié. 'gemini-pro' est un bon équilibre performance/coût.
        # J'ai remis 'gemini-pro' qui est plus polyvalent pour le texte,
        # mais utilisez 'gemini-2.5-flash' si vous l'avez testé et qu'il vous convient.
        model = genai.GenerativeModel('gemini-2.5-flash')

        # Définissez le rôle du modèle et la requête utilisateur avec l'instruction de langue
        prompt = (
            f"En tant qu'expert en cultures africaines et camerounaises, "
            f"fournis des faits culturels, des explications sur les origines des peuples, ethnies, "
            f"ou des cultures spécifiques. Concentre-toi sur des informations précises et factuelles. "
            f"{language_instruction} Le sujet est : {query}" # Ajout de l'instruction de langue ici
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