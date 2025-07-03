document.addEventListener('DOMContentLoaded', function() {
    // --- Animations simples au scroll ---
    const animatedElements = document.querySelectorAll('.animate__animated');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationClass = entry.target.classList.contains('animate__fadeIn') ? 'animate__fadeIn' :
                                       entry.target.classList.contains('animate__fadeInUp') ? 'animate__fadeInUp' :
                                       entry.target.classList.contains('animate__zoomIn') ? 'animate__zoomIn' :
                                       entry.target.classList.contains('animate__slideInUp') ? 'animate__slideInUp' :
                                       entry.target.classList.contains('animate__slideInRight') ? 'animate__slideInRight' :
                                       ''; // Ajoutez d'autres classes Animate.css si utilisées
                if (animationClass) {
                    entry.target.classList.add(animationClass);
                    // Optionnel: stopper l'observation après la première animation
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 }); // Déclenche quand 10% de l'élément est visible

    animatedElements.forEach(element => {
        // Retirer les classes d'animation initiales pour les ajouter au scroll
        element.classList.remove('animate__fadeIn', 'animate__fadeInUp', 'animate__zoomIn', 'animate__slideInUp', 'animate__slideInRight');
        observer.observe(element);
    });

    // --- Gestion du "Lire la suite" pour les descriptions longues (événements et blogs) ---
    document.querySelectorAll('.toggle-description-btn').forEach(button => {
        button.addEventListener('click', function() {
            const description = this.closest('.card-body').querySelector('.card-text-description');
            if (description) {
                description.classList.toggle('expanded');
                this.textContent = description.classList.contains('expanded') ? 'Lire moins' : 'Lire la suite';
            }
        });
    });

    // --- Basculement d'onglet de navigation (rendez les sections actives) ---
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Faire défiler la page vers la section correspondante
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Pré-remplir les données utilisateur (simulé) ---
    // En production, ces données viendraient de Django (context ou via une API)
    const userData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john.doe@example.com",
        phone: "+237 678 123 456",
        region: "Centre",
        department: "Mfoundi",
        bio: "Passionné par les cultures africaines et européennes. J'adore découvrir de nouvelles traditions et partager mes expériences de voyage."
    };

    function displayUserData() {
        document.getElementById('user-display-name').textContent = `${userData.firstName} ${userData.lastName}`;
        document.getElementById('user-display-username').textContent = `@${userData.username}`;
        document.getElementById('user-display-email').textContent = userData.email;
        document.getElementById('user-display-phone').textContent = userData.phone;
        document.getElementById('user-display-region').textContent = userData.region;
        document.getElementById('user-display-department').textContent = userData.department;
        document.getElementById('user-display-bio').textContent = userData.bio;

        // Pré-remplir les modaux de modification
        const userInfoForm = document.getElementById('userInfoForm');
        if (userInfoForm) {
            userInfoForm.querySelector('#inputFirstName').value = userData.firstName;
            userInfoForm.querySelector('#inputLastName').value = userData.lastName;
            userInfoForm.querySelector('#inputEmail').value = userData.email;
            userInfoForm.querySelector('#inputPhone').value = userData.phone;
            userInfoForm.querySelector('#inputBio').value = userData.bio;
            // Pour les selects, il faudrait sélectionner l'option correspondante
            // userInfoForm.querySelector('#inputRegion').value = userData.region;
            // userInfoForm.querySelector('#inputDepartment').value = userData.department;
        }
    }

    displayUserData(); // Appel initial pour afficher les données

    // --- Gestion des soumissions de formulaires dans les Modals ---
    // (Ces soumissions devraient idéalement utiliser AJAX pour une meilleure UX,
    // mais ici, nous nous en tenons à des alertes simples pour simuler le succès)

    const profilePictureForm = document.getElementById('profilePictureForm');
    if (profilePictureForm) {
        profilePictureForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Photo de profil enregistrée ! (Ceci serait envoyé au serveur)');
            // Fermer le modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            if (modal) modal.hide();
        });
    }

    const userInfoForm = document.getElementById('userInfoForm');
    if (userInfoForm) {
        userInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Récupérer les nouvelles valeurs (simulées)
            userData.firstName = this.querySelector('#inputFirstName').value;
            userData.lastName = this.querySelector('#inputLastName').value;
            userData.email = this.querySelector('#inputEmail').value;
            userData.phone = this.querySelector('#inputPhone').value;
            userData.region = this.querySelector('#inputRegion').value; // Mettez à jour aussi la valeur affichée
            userData.department = this.querySelector('#inputDepartment').value; // Mettez à jour aussi la valeur affichée
            userData.bio = this.querySelector('#inputBio').value;
            displayUserData(); // Mettre à jour l'affichage

            alert('Informations personnelles enregistrées ! (Ceci serait envoyé au serveur)');
            // Fermer le modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editInfoModal'));
            if (modal) modal.hide();
        });
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPass = this.querySelector('#currentPassword').value;
            const newPass = this.querySelector('#newPassword').value;
            const confirmNewPass = this.querySelector('#confirmNewPassword').value;

            if (newPass !== confirmNewPass) {
                alert('Les nouveaux mots de passe ne correspondent pas !');
                return;
            }
            if (newPass.length < 6) { // Exemple de validation simple
                alert('Le nouveau mot de passe doit contenir au moins 6 caractères.');
                return;
            }

            alert('Mot de passe changé avec succès ! (Ceci serait envoyé au serveur)');
            // Réinitialiser le formulaire
            this.reset();
            // Fermer le modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
            if (modal) modal.hide();
        });
    }

    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const eventName = this.querySelector('#eventName').value;
            const eventDate = this.querySelector('#eventDate').value;
            const eventLocation = this.querySelector('#eventLocation').value;
            const eventDescription = this.querySelector('#eventDescription').value;

            // Simuler l'ajout d'un événement à la liste
            const eventsList = document.getElementById('events-list');
            const newEventHtml = `
                <div class="col">
                    <div class="card h-100 event-card animate__animated animate__zoomIn">
                        <img src="https://via.placeholder.com/400x200" class="card-img-top" alt="Image de l'événement">
                        <div class="card-body">
                            <h5 class="card-title">${eventName}</h5>
                            <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${eventLocation}</p>
                            <p class="card-text"><i class="fas fa-calendar-day"></i> ${eventDate}</p>
                            <p class="card-text card-text-description">${eventDescription}</p>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="btn btn-sm btn-primary">Détails</a>
                            <button class="btn btn-sm btn-outline-secondary float-end toggle-description-btn">Lire la suite</button>
                        </div>
                    </div>
                </div>
            `;
            eventsList.insertAdjacentHTML('afterbegin', newEventHtml); // Ajoute au début de la liste

            alert('Événement créé ! (Ceci serait envoyé au serveur)');
            this.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
            if (modal) modal.hide();
        });
    }

    const createBlogForm = document.getElementById('createBlogForm');
    if (createBlogForm) {
        createBlogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const blogTitle = this.querySelector('#blogTitle').value;
            const blogContent = this.querySelector('#blogContent').value;

            // Simuler l'ajout d'un blog à la liste
            const blogsList = document.getElementById('blogs-list');
            const newBlogHtml = `
                <div class="col">
                    <div class="card h-100 blog-card animate__animated animate__slideInUp">
                        <img src="https://via.placeholder.com/400x200" class="card-img-top" alt="Image du blog">
                        <div class="card-body">
                            <h5 class="card-title">${blogTitle}</h5>
                            <p class="card-text"><small class="text-muted">Par ${userData.firstName} ${userData.lastName} le ${new Date().toLocaleDateString('fr-FR')}</small></p>
                            <p class="card-text card-text-description">${blogContent}</p>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="btn btn-sm btn-primary">Lire le blog</a>
                            <button class="btn btn-sm btn-outline-secondary float-end toggle-description-btn">Lire la suite</button>
                        </div>
                    </div>
                </div>
            `;
            blogsList.insertAdjacentHTML('afterbegin', newBlogHtml);

            alert('Blog publié ! (Ceci serait envoyé au serveur)');
            this.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('createBlogModal'));
            if (modal) modal.hide();
        });
    }

    const createTopicForm = document.getElementById('createTopicForm');
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const topicTitle = this.querySelector('#topicTitle').value;
            const topicContent = this.querySelector('#topicContent').value;

            // Simuler l'ajout d'un sujet au forum
            const forumTopicsList = document.getElementById('forum-topics');
            const newTopicHtml = `
                <a href="#" class="list-group-item list-group-item-action flex-column align-items-start forum-topic-item animate__animated animate__slideInRight">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${topicTitle}</h5>
                        <small class="text-muted">Il y a quelques secondes</small>
                    </div>
                    <p class="mb-1">${topicContent.substring(0, 100)}...</p> {# Afficher un extrait #}
                    <small>Par ${userData.firstName} ${userData.lastName} - 0 réponses</small>
                </a>
            `;
            forumTopicsList.insertAdjacentHTML('afterbegin', newTopicHtml);

            alert('Sujet de forum créé ! (Ceci serait envoyé au serveur)');
            this.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('createTopicModal'));
            if (modal) modal.hide();
        });
    }

    // Initialisation des tooltips (si vous avez des éléments avec data-bs-toggle="tooltip")
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })

});