# Dans votre fichier models.py (par exemple, accounts/models.py)

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Il est crucial d'importer vos modèles Region et Departement ici.
# Assurez-vous que le chemin d'importation est correct pour votre projet.
# Par exemple, si Region et Departement sont dans une application nommée 'region_app':
# from region_app.models import Region, Departement
# Ou si elles sont dans un fichier 'models.py' directement dans l'app 'region':
from region.models import Region, Departement  # Ceci est un chemin d'importation commun


# --- Gestionnaire de Modèle User ---
class UserManager(BaseUserManager):
    """
    Gestionnaire personnalisé pour le modèle User.
    Fournit des méthodes pour créer des utilisateurs normaux et des super-utilisateurs.
    """

    def create_user(self, username, nom, prenom, tel, region, departement, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("Le nom d'utilisateur est requis.")
        if not nom:
            raise ValueError("Le nom est requis.")
        if not prenom:
            raise ValueError("Le prénom est requis.")
        if not tel:
            raise ValueError("Le numéro de téléphone est requis.")
        if not region:
            raise ValueError("La région d'origine est requise.")
        if not departement:
            raise ValueError("Le département d'origine est requis.")

        user = self.model(
            username=username,
            nom=nom,
            prenom=prenom,
            tel=tel,
            region=region,
            departement=departement,
            email=self.normalize_email(email) if email else None,  # Normalise l'email si fourni
            **extra_fields
        )
        user.set_password(password)  # set_password gère le hachage sécurisé du mot de passe
        user.save(using=self._db)
        return user

    def create_superuser(self, username, nom, prenom, tel, region, departement, email=None, password=None,
                         **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        # Votre champ personnalisé 'is_admin'
        extra_fields.setdefault('is_admin', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        # Appelle create_user en passant tous les champs nécessaires, y compris les extra_fields pour les permissions
        return self.create_user(username, nom, prenom, tel, region, departement, email, password, **extra_fields)


# --- Votre Modèle User Personnalisé ---
class User(AbstractBaseUser, PermissionsMixin):
    """
    Modèle d'utilisateur personnalisé pour votre application.
    Il étend AbstractBaseUser et PermissionsMixin pour une gestion complète des utilisateurs
    avec des champs spécifiques comme le numéro de téléphone, la région et le département d'origine.
    """
    nom = models.CharField(max_length=255, verbose_name="Nom", blank=False, null=False)
    prenom = models.CharField(max_length=255, verbose_name="Prénom", blank=False, null=False)
    # Le nom d'utilisateur est l'identifiant de connexion principal et doit être unique.
    username = models.CharField(max_length=150, verbose_name="Nom d'utilisateur", unique=True, null=False, blank=False)
    # L'email est généralement unique et peut être utilisé pour la récupération de compte.
    email = models.EmailField(max_length=255, unique=True, null=False, blank=False, verbose_name="Adresse Email")
    # Le champ 'password' est géré par AbstractBaseUser, ne le définissez pas ici.

    tel = models.CharField(max_length=20, verbose_name="Téléphone", unique=True, blank=False, null=False)

    # Liens vers vos modèles Region et Departement.
    # Assurez-vous que l'importation de Region et Departement est correcte en haut du fichier.
    region = models.ForeignKey(
        Region,  # Référence directe au modèle importé
        on_delete=models.SET_NULL,  # Si la région est supprimée, ce champ devient NULL.
        null=True,  # Permet à l'utilisateur d'être créé sans région initiale.
        blank=False,  # Mais il faudra le renseigner dans les formulaires.
        related_name='utilisateurs_de_cette_region',
        verbose_name="Region d'origine"
    )

    departement = models.ForeignKey(
        Departement,  # Référence directe au modèle importé
        on_delete=models.SET_NULL,  # Si le département est supprimé, ce champ devient NULL.
        null=True,  # Permet à l'utilisateur d'être créé sans département initial.
        blank=False,  # Mais il faudra le renseigner dans les formulaires.
        related_name='utilisateurs_de_ce_departement',
        verbose_name="Departement d'origine"
    )

    # Champ pour le profil (si c'est un rôle ou une catégorie, par exemple)
    profil = models.CharField(max_length=255, verbose_name="Profil", blank=True, null=True)

    # Champs standards pour la gestion des utilisateurs et des permissions par Django
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    # Attache le gestionnaire personnalisé à votre modèle
    objects = UserManager()

    # Définit le champ à utiliser comme identifiant unique pour la connexion
    USERNAME_FIELD = "username"
    # Ces champs seront demandés lors de la création d'un superutilisateur via `createsuperuser`,
    # en plus du USERNAME_FIELD et du mot de passe.
    REQUIRED_FIELDS = ["nom", "prenom", "tel", "region", "departement", "email"]

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['nom', 'prenom']  # Tri par défaut

    def __str__(self):
        """Représentation textuelle de l'objet utilisateur."""
        return f"{self.nom} {self.prenom} ({self.username})"

    def get_full_name(self):
        """Retourne le nom complet de l'utilisateur."""
        return f"{self.nom} {self.prenom}"

    def get_short_name(self):
        """Retourne le nom court de l'utilisateur (ici, le nom d'utilisateur)."""
        return self.username
