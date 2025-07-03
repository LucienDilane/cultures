from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages  # Pour afficher des messages à l'utilisateur

from .models import User
from region.models import Region, Departement
from django.db import IntegrityError  # Pour gérer les erreurs d'unicité (username, email, tel)
from django.core.validators import validate_email  # Pour valider le format de l'email
from django.core.exceptions import ValidationError  # Pour capturer les erreurs de validation


# Vue pour afficher le formulaire de connexion/enregistrement
def connexion_enregistrement(request):
    # Initialisation des variables pour le contexte
    form_data = {}
    form_errors = {}

    # Si la requête vient d'une soumission d'enregistrement échouée,
    # les données et erreurs peuvent être passées via la session ou un mécanisme similaire
    # Pour l'instant, nous allons les gérer directement dans la vue register_user.

    return render(request, "user/connect_register.html", {
        'form_data': form_data,
        'form_errors': form_errors,
    })


# Vue pour gérer l'enregistrement de l'utilisateur
def register_user(request):
    if request.method == 'POST':
        # Récupération des données du formulaire
        nom = request.POST.get('first_name')
        prenom = request.POST.get('last_name')
        username = request.POST.get('username')
        mail = request.POST.get('email')
        tel = request.POST.get('phone_number')
        region_origine_id = request.POST.get('region_of_origin')
        departement_origine_id = request.POST.get('department_of_origin')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')  # Récupérer la confirmation du mot de passe

        form_errors = {}  # Dictionnaire pour stocker les erreurs de validation

        # --- Validation des données ---
        if not nom:
            form_errors.setdefault('first_name', []).append('Le prénom est requis.')
        if not prenom:
            form_errors.setdefault('last_name', []).append('Le nom est requis.')
        if not username:
            form_errors.setdefault('username', []).append('Le nom d\'utilisateur est requis.')
        elif User.objects.filter(username=username).exists():
            form_errors.setdefault('username', []).append('Ce nom d\'utilisateur est déjà pris.')

        if not mail:
            form_errors.setdefault('email', []).append('L\'adresse e-mail est requise.')
        else:
            try:
                validate_email(mail)
            except ValidationError:
                form_errors.setdefault('email', []).append('Veuillez entrer une adresse e-mail valide.')
            if User.objects.filter(email=mail).exists():
                form_errors.setdefault('email', []).append('Cette adresse e-mail est déjà utilisée.')

        if not tel:
            form_errors.setdefault('phone_number', []).append('Le numéro de téléphone est requis.')
        elif User.objects.filter(tel=tel).exists():
            form_errors.setdefault('phone_number', []).append('Ce numéro de téléphone est déjà utilisé.')

        if not password or len(password) < 6:
            form_errors.setdefault('password', []).append('Le mot de passe doit contenir au moins 6 caractères.')
        if password != password2:
            form_errors.setdefault('password2', []).append('Les mots de passe ne correspondent pas.')

        region_obj = None
        departement_obj = None

        if not region_origine_id:
            form_errors.setdefault('region_of_origin', []).append('Veuillez sélectionner une région.')
        else:
            try:
                region_obj = Region.objects.get(id=region_origine_id)
            except Region.DoesNotExist:
                form_errors.setdefault('region_of_origin', []).append('Région sélectionnée invalide.')

        if not departement_origine_id:
            form_errors.setdefault('department_of_origin', []).append('Veuillez sélectionner un département.')
        else:
            try:
                departement_obj = Departement.objects.get(id=departement_origine_id)
            except Departement.DoesNotExist:
                form_errors.setdefault('department_of_origin', []).append('Département sélectionné invalide.')

        # Si des erreurs de validation sont présentes, réafficher le formulaire avec les erreurs
        if form_errors:
            # Conserver les données saisies pour ne pas obliger l'utilisateur à tout retaper
            form_data = request.POST.copy()
            # Passer les erreurs et les données au template
            return render(request, "user/connect_register.html", {
                'form_data': form_data,
                'form_errors': form_errors,
            })

        # --- Création de l'utilisateur si toutes les validations passent ---
        try:
            user = User(
                nom=nom,
                prenom=prenom,
                username=username,
                email=mail,
                tel=tel,
                region=region_obj,
                departement=departement_obj,
                # 'profil' peut être ajouté ici si vous avez une valeur par défaut ou si vous le collectez
            )
            user.set_password(password)  # Passez le mot de passe en texte clair, Django le hachera
            user.save()

            messages.success(request, 'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.')
            return redirect('connect')  # Rediriger vers la page de connexion après succès

        except IntegrityError as e:
            # Gérer les erreurs d'unicité qui pourraient ne pas avoir été capturées par les filtres exists()
            # C'est une sécurité supplémentaire
            if 'username' in str(e):
                form_errors.setdefault('username', []).append('Ce nom d\'utilisateur est déjà pris.')
            elif 'email' in str(e):
                form_errors.setdefault('email', []).append('Cette adresse e-mail est déjà utilisée.')
            elif 'tel' in str(e):
                form_errors.setdefault('phone_number', []).append('Ce numéro de téléphone est déjà utilisé.')
            else:
                form_errors.setdefault('__all__', []).append(
                    "Une erreur est survenue lors de l'enregistrement. Veuillez vérifier vos informations.")

            form_data = request.POST.copy()
            return render(request, "user/connect_register.html", {
                'form_data': form_data,
                'form_errors': form_errors,
            })

        except Exception as e:
            # Gérer toute autre erreur inattendue
            messages.error(request, 'Une erreur inattendue est survenue lors de l\'enregistrement. Veuillez réessayer.')
            print(f"Erreur inattendue lors de l'enregistrement: {e}")  # Pour le débogage serveur
            form_data = request.POST.copy()
            return render(request, "user/connect_register.html", {
                'form_data': form_data,
                'form_errors': form_errors,
            })

    # Si la méthode n'est pas POST, simplement afficher le formulaire vide
    return redirect('connect')  # Ou render le template directement si vous voulez qu'il s'affiche vide


def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is None:
            try:
                # Si l'identifiant ressemble à un email
                if '@' in username:
                    user_by_email = User.objects.get(email=username)
                    user = authenticate(request, username=user_by_email.username, password=password)
            except User.DoesNotExist:
                pass  # L'utilisateur par email n'existe pas non plus

        if user is not None:
            login(request, user)
            #messages.success(request, f'Bienvenue, {user.username} !')
            return redirect('profil_user')  # Rediriger vers votre page d'accueil ou tableau de bord
        else:
            messages.error(request, 'Nom d\'utilisateur/Email ou mot de passe incorrect.')
            # Pré-remplir l'identifiant pour l'utilisateur
            form_data = {'identifier': username}
            # Retourner au template avec les erreurs et les données
            return render(request, "user/connect_register.html", {
                'form_data_login': form_data,  # Utilisez un nom différent pour éviter les conflits
                'login_error': 'Nom d\'utilisateur/Email ou mot de passe incorrect.',
                'show_login_form': True  # Pour que le JS sache quel formulaire activer
            })

    # Si la méthode n'est pas POST, rediriger ou afficher la page par défaut
    return redirect('connect')  # Rediriger vers la page de connexion par défaut si GET


# Vue de déconnexion (optionnel, mais utile)
def logout_user(request):
    logout(request)
    messages.info(request, 'Vous avez été déconnecté.')
    return redirect('connect')  # Rediriger vers la page de connexionturn render(request,"user/user_profil.html")

def profil_user(request):
    return render(request,"user/user_profil.html");