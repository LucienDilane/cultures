# yourapp/views.py (Exemple)

from django.http import JsonResponse
from .models import Region, Departement
# Importez également les décorateurs pour les vues basées sur des fonctions
from django.views.decorators.http import require_GET
import json # Pour gérer le json.dumps si nécessaire, bien que JsonResponse le fasse

@require_GET
def get_regions(request):
    """
    Retourne la liste de toutes les régions.
    """
    regions = Region.objects.all().order_by('nom')
    # Créez une liste de dictionnaires pour la sérialisation JSON
    data = [{'id': region.id, 'nom': region.nom} for region in regions]
    return JsonResponse(data, safe=False) # safe=False est nécessaire si la donnée de plus haut niveau est une liste

@require_GET
def get_departments_by_region(request):
    """
    Retourne la liste des départements pour une région donnée par son ID.
    """
    region_id = request.GET.get('region_id') # Récupère le paramètre 'region_id' de l'URL
    if region_id:
        try:
            # Assurez-vous que la région existe avant de filtrer les départements
            region = Region.objects.get(id=region_id)
            departments = Departement.objects.filter(region=region).order_by('nom')
            data = [{'id': department.id, 'nom': department.nom} for department in departments]
            return JsonResponse(data, safe=False)
        except Region.DoesNotExist:
            return JsonResponse({'error': 'Region not found'}, status=404)
    return JsonResponse({'error': 'region_id parameter is required'}, status=400) # Mauvaise requête si region_id manque