# Generated by Django 5.1.7 on 2025-07-02 00:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('region', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('nom', models.CharField(max_length=255, verbose_name='Nom')),
                ('prenom', models.CharField(max_length=255, verbose_name='Prénom')),
                ('username', models.CharField(max_length=150, unique=True, verbose_name="Nom d'utilisateur")),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='Adresse Email')),
                ('tel', models.CharField(max_length=20, unique=True, verbose_name='Téléphone')),
                ('profil', models.CharField(blank=True, max_length=255, null=True, verbose_name='Profil')),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('departement', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='utilisateurs_de_ce_departement', to='region.departement', verbose_name="Departement d'origine")),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('region', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='utilisateurs_de_cette_region', to='region.region', verbose_name="Region d'origine")),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Utilisateur',
                'verbose_name_plural': 'Utilisateurs',
                'ordering': ['nom', 'prenom'],
            },
        ),
    ]
