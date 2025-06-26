from django.db import models

# Create your models here.
class Region(models.Model):
    nom=models.CharField(max_length=20,unique=True,verbose_name='region')

    def __str__(self):
        return self.nom

class Departement(models.Model):
    nom=models.CharField(max_length=20, unique=True, verbose_name='departement')
    region= models.ForeignKey(Region, on_delete=models.CASCADE,related_name='regions')

    def __str__(self):
        return f"Departement {self.nom} de la region {self.region}"