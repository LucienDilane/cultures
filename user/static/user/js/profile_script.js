document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link-section');
    const contentSections = document.querySelectorAll('.content-section');

    // Fonction pour masquer toutes les sections et désactiver tous les liens
    function hideAllSectionsAndDeactivateLinks() {
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none'; // Masquer explicitement pour un contrôle total
        });
        navLinks.forEach(link => link.classList.remove('active'));
    }

    // Fonction pour activer une section et son lien correspondant
    function activateSection(targetId) {
        hideAllSectionsAndDeactivateLinks();

        // Activer le lien de navigation
        const activeNavLink = document.querySelector(`.nav-link-section[data-target-section="${targetId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }

        // Afficher la section de contenu
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block'; // Afficher la section
        }
    }

    // Gérer les clics sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le comportement de lien par défaut

            const targetId = this.dataset.targetSection; // Récupère l'ID de la section cible

            // Gérer les liens spéciaux (Accueil, Déconnexion) qui pourraient ne pas cibler une section locale
            if (targetId === 'home') {
                // Rediriger vers la page d'accueil si c'est un lien externe
                window.location.href = '/'; // Ou l'URL de votre page d'accueil
            } else if (targetId === 'logout') {
                // Logique de déconnexion
                alert('Déconnexion simulée!');
                // window.location.href = '/logout/'; // Ou l'URL de votre page de déconnexion
            } else {
                // Activer la section locale
                activateSection(targetId);
                // Optionnel: faire défiler vers la section activée si elle n'est pas déjà visible
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Initialisation au chargement de la page
    // Vérifier si un hash est présent dans l'URL (ex: #events-list) pour activer la bonne section
    const initialHash = window.location.hash.substring(1); // Supprimer le '#'
    if (initialHash && document.getElementById(initialHash)) {
        activateSection(initialHash);
    } else {
        // Sinon, activer la section par défaut (Mon Profil)
        activateSection('profile-info');
    }


    // --- Logique de simulation des boutons (conservez ou adaptez votre code existant) ---

    // Bouton "Participer"
    document.querySelectorAll('.btn-join').forEach(button => {
        button.addEventListener('click', function() {
            const eventTitle = this.closest('.event-item').querySelector('.event-title').textContent;
            alert(`Vous participez à l'événement : "${eventTitle}" (simulation)`);
        });
    });

    // Bouton "Publier l'événement"
    document.getElementById('eventForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Événement simulé créé !');
        this.reset(); // Réinitialiser le formulaire
    });

    // Bouton "Écrire un nouvel article"
    document.querySelector('.create-blog-btn')?.addEventListener('click', function() {
        alert('Redirection vers le formulaire de création d\'article de blog (simulation)');
        // window.location.href = '/creer-article/'; // Exemple de redirection
    });

    // Boutons "Voir l'article"
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const blogTitle = this.closest('.blog-item').querySelector('.blog-title').textContent;
            alert(`Affichage de l'article : "${blogTitle}" (redirection simulée)`);
            // window.location.href = `/blog/${encodeURIComponent(blogTitle.toLowerCase().replace(/ /g, '-'))}/`;
        });
    });

    // Boutons "Modifier" l'article
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
            const blogTitle = this.closest('.blog-item').querySelector('.blog-title').textContent;
            alert(`Modification de l'article : "${blogTitle}" (simulation)`);
        });
    });

    // Boutons "Supprimer" l'article
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const blogTitle = this.closest('.blog-item').querySelector('.blog-title').textContent;
            if (confirm(`Voulez-vous vraiment supprimer l'article : "${blogTitle}" ?`)) {
                alert(`Article "${blogTitle}" supprimé (simulation)`);
                // Logique de suppression réelle ici (requête AJAX)
                this.closest('.blog-item').remove(); // Supprime l'élément du DOM
            }
        });
    });

    // Boutons "Charger plus"
    document.querySelectorAll('.load-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.closest('.content-section').id;
            let contentType = '';
            if (sectionId === 'events-list') {
                contentType = 'événements';
            } else if (sectionId === 'my-blogs' || sectionId === 'blogs-list') {
                contentType = 'blogs';
            }
            alert(`Chargement de plus de ${contentType} (simulation)`);
            // Logique de chargement AJAX pour plus de contenu ici
        });
    });
});