document.addEventListener('DOMContentLoaded', function() {
    // --- Éléments du DOM pour le basculement des formulaires ---
    const mainContainer = document.getElementById('mainContainer');
    const formWrapper = document.getElementById('formWrapper');
    const imageSection = document.getElementById('imageSection'); // Récupéré pour la mise à jour de l'image de fond

    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    // --- Éléments du DOM pour le contenu dynamique de l'image de fond ---
    const dynamicImage = document.getElementById('dynamicImage');
    const dynamicTitle = document.getElementById('dynamicTitle');
    const dynamicText = document.getElementById('dynamicText');

    // Contenu pour les différents états (connexion/inscription)
    const images = {
        login: 'https://i.pinimg.com/736x/0e/92/a3/0e92a37772f91de30a3d6bb8cc4698dd.jpg',
        register: 'https://i.pinimg.com/736x/08/7b/b9/087bb9c178ea81b896b8ef928568ffba.jpg'
    };

    const texts = {
        login: {
            title: 'Bienvenue !',
            description: 'Connectez-vous pour accéder à votre compte.'
        },
        register: {
            title: 'Rejoignez-nous !',
            description: 'Créez votre compte en quelques étapes.'
        }
    };

    // Fonctions pour gérer l'affichage des formulaires et l'animation
    function showRegisterForm() {
        mainContainer.classList.add('show-register');
        // Mettre à jour l'image et le texte pour l'inscription
        dynamicImage.src = images.register;
        dynamicTitle.textContent = texts.register.title;
        // MODIFICATION ICI: Utilisation de innerHTML pour inclure le lien CORRECTEMENT
        dynamicText.innerHTML = texts.register.description + '<br><br>Vous avez déjà un compte ? <a href="#" id="imageShowLoginLink">Connectez-vous</a>';

        // Important : Attacher l'écouteur d'événements au nouveau lien dans l'image
        // Il faut s'assurer que l'élément existe avant d'attacher l'écouteur.
        // Utiliser setTimeout avec un petit délai peut être utile si la mise à jour du DOM prend un instant.
        setTimeout(() => {
            const imageShowLoginLink = document.getElementById('imageShowLoginLink');
            if (imageShowLoginLink) {
                imageShowLoginLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    showLoginForm(); // Revenir au formulaire de connexion
                });
            }
        }, 50); // Petit délai pour laisser le DOM se mettre à jour

        updateContainerHeight(); // Ajuster la hauteur après le changement de formulaire
    }

    function showLoginForm() {
        mainContainer.classList.remove('show-register');
        // Mettre à jour l'image et le texte pour la connexion
        dynamicImage.src = images.login;
        dynamicTitle.textContent = texts.login.title;
        dynamicText.textContent = texts.login.description; // Pas de lien ici

        updateContainerHeight(); // Ajuster la hauteur après le changement de formulaire
    }

    // Fonction pour ajuster la hauteur du main-container
    function updateContainerHeight() {
        // Déterminer quel formulaire est actuellement visible (sans l'animation de transition)
        const isRegisterActive = mainContainer.classList.contains('show-register');
        const activeFormBox = isRegisterActive ? document.querySelector('.form-box.register') : document.querySelector('.form-box.login');

        if (activeFormBox) {
            // Obtenir la hauteur réelle du contenu du formulaire actif
            const newHeight = activeFormBox.scrollHeight + 80; // Ajustez 80px si nécessaire
            mainContainer.style.height = `${newHeight}px`;
        } else {
            mainContainer.style.height = 'auto'; // Fallback
        }
    }


    // Écouteurs d'événements pour les liens de basculement
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }

    // --- Gestion de la validation du formulaire d'inscription ---
    const registerForm = document.getElementById('registerForm');
    const registerFormErrorsDiv = document.getElementById('registerFormErrors');
    const passwordInput = document.getElementById('password');
    const password2Input = document.getElementById('password2');
    const password2ErrorsUl = document.getElementById('password2_errors');
    const registerSubmitButton = registerForm ? registerForm.querySelector('button[type="submit"]') : null;


    function validateRegisterForm() {
        let isValid = true;
        const formData = new FormData(registerForm);
        const errors = {}; // Stocker les erreurs par champ

        // Réinitialiser les messages d'erreur du formulaire
        if (registerFormErrorsDiv) {
            registerFormErrorsDiv.style.display = 'none';
            registerFormErrorsDiv.innerHTML = '';
        }
        document.querySelectorAll('.field-errors').forEach(ul => ul.innerHTML = '');

        // --- Réinitialiser le contenu dynamique de l'image si aucune erreur n'était affichée ---
        dynamicTitle.textContent = texts.register.title;
        dynamicText.innerHTML = texts.register.description + '<br><br>Vous avez déjà un compte ? <a href="#" id="imageShowLoginLink">Connectez-vous</a>';


        // Exemples de validation côté client
        if (formData.get('first_name').trim() === '') {
            errors.first_name = ['Le prénom est requis.'];
            isValid = false;
        }
        if (formData.get('last_name').trim() === '') {
            errors.last_name = ['Le nom est requis.'];
            isValid = false;
        }
        if (formData.get('username').trim() === '') {
            errors.username = ['Le nom d\'utilisateur est requis.'];
            isValid = false;
        }
        if (formData.get('phone_number').trim() === '') {
            errors.phone_number = ['Le numéro de téléphone est requis.'];
            isValid = false;
        }
        // Validation des champs Région et Département
        if (!regionSelect || regionSelect.value === '' || regionSelect.value === 'Chargement des régions...') {
            errors.region_of_origin = ['Veuillez sélectionner une région.'];
            isValid = false;
        }
        if (!departmentSelect || departmentSelect.value === '' || departmentSelect.value === 'Chargement des départements...' || departmentSelect.disabled) {
            errors.department_of_origin = ['Veuillez sélectionner un département valide.'];
            isValid = false;
        }

        const password = formData.get('password');
        const password2 = formData.get('password2');
        if (password.length < 6) {
            errors.password = ['Le mot de passe doit contenir au moins 6 caractères.'];
            isValid = false;
        }
        if (password !== password2) {
            errors.password2 = ['Les mots de passe ne correspondent pas.'];
            isValid = false;
        }

        // Afficher les erreurs
        if (!isValid) {
            let errorHtml = '';
            for (const field in errors) {
                const ul = document.getElementById(`${field}_errors`);
                if (ul) {
                    ul.innerHTML = ''; // Clear previous errors
                    errors[field].forEach(error => {
                        const li = document.createElement('li');
                        li.textContent = error;
                        ul.appendChild(li);
                    });
                }
                // Ajouter les erreurs à la liste pour l'affichage sur l'image
                errors[field].forEach(error => {
                    errorHtml += `<p style="color: red; margin: 5px 0;">${error}</p>`;
                });
            }

            // Afficher le message d'erreur général dans le formulaire
            if (registerFormErrorsDiv) {
                registerFormErrorsDiv.style.display = 'block';
                registerFormErrorsDiv.innerHTML = '<p style="color: red;">Veuillez corriger les erreurs avant de soumettre.</p>';
            }

            // --- NOUVEAU : Remplacer le texte sur l'image par les erreurs ---
            dynamicTitle.textContent = 'Erreurs d\'inscription !';
            dynamicText.innerHTML = errorHtml; // Insérer toutes les erreurs collectées
            // Si vous voulez conserver le lien "Connectez-vous" après les erreurs, ajoutez-le ici:
            // dynamicText.innerHTML += '<br><br><p style="color: gray;">Vous avez déjà un compte ? <a href="#" id="imageShowLoginLink" style="color: gray;">Connectez-vous</a></p>';
            // et n'oubliez pas de rattacher l'écouteur d'événements comme dans showRegisterForm()


        }
        return isValid;
    }

    // New: Password matching validation
    function checkPasswordMatch() {
        if (!passwordInput || !password2Input || !password2ErrorsUl || !registerSubmitButton) return;

        const password = passwordInput.value;
        const password2 = password2Input.value;

        password2ErrorsUl.innerHTML = ''; // Clear previous errors

        if (password !== password2 && password2 !== '') {
            const li = document.createElement('li');
            li.textContent = 'Les mots de passe ne correspondent pas.';
            li.style.color = 'red'; // Set text color to red
            password2ErrorsUl.appendChild(li);
            registerSubmitButton.disabled = true; // Disable submit button
        } else {
            registerSubmitButton.disabled = false; // Enable submit button if passwords match or password2 is empty
        }

        // Also check password length here to enable/disable button more accurately
        if (password.length < 6) {
            registerSubmitButton.disabled = true;
        }
    }

    if (passwordInput && password2Input) {
        passwordInput.addEventListener('input', checkPasswordMatch);
        password2Input.addEventListener('input', checkPasswordMatch);
    }
    // End New

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            // Empêche la soumission par défaut UNIQUEMENT si la validation côté client échoue
            if (!validateRegisterForm()) {
                event.preventDefault();
            }
            // Si validateRegisterForm() renvoie true, le formulaire sera soumis normalement par le navigateur.
        });
    }

    // --- Gestion du formulaire de connexion ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Aucune validation côté client ici qui empêcherait la soumission.
            // Le formulaire sera soumis normalement par le navigateur.
        });
    }

    // --- Chargement dynamique des régions et départements ---
    const regionSelect = document.getElementById('regionSelect');
    const departmentSelect = document.getElementById('departmentSelect');

    // Récupérer le div qui contient les URLs d'API
    const apiEndpointsDiv = document.getElementById('api-endpoints');
    let regionsApiUrl = '';
    let departmentsApiUrl = '';

    if (apiEndpointsDiv) {
        regionsApiUrl = apiEndpointsDiv.dataset.regionsUrl;
        departmentsApiUrl = apiEndpointsDiv.dataset.departmentsUrl;
    } else {
        // Fallback si le div api-endpoints n'est pas trouvé
        console.warn("L'élément #api-endpoints n'a pas été trouvé. Utilisation d'URLs par défaut. " +
                     "Assurez-vous que votre HTML est rendu par Django et contient cet élément, " +
                     "ou ajustez les URLs du fallback pour correspondre à votre configuration Django.");
        regionsApiUrl = '/api/regions/'; // Chemin par défaut si votre API est à la racine
        departmentsApiUrl = '/api/departments/'; // Chemin par défaut si votre API est à la racine
    }

    // Fonction pour charger les régions
    function loadRegions() {
        if (!regionSelect) return;

        regionSelect.innerHTML = '<option value="">Chargement des régions...</option>';

        fetch(regionsApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(regions => {
                regionSelect.innerHTML = '<option value="">Sélectionnez votre Région</option>';
                regions.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.id;
                    option.textContent = region.nom; // Utilisez 'nom' selon vos modèles Django
                    regionSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des régions:', error);
                regionSelect.innerHTML = '<option value="">Erreur de chargement des régions</option>';
            });
    }

    // Fonction pour charger les départements en fonction de la région sélectionnée
    function loadDepartments(regionId) {
        if (!departmentSelect) return;

        departmentSelect.innerHTML = '<option value="">Chargement des départements...</option>';
        departmentSelect.disabled = true;

        if (!regionId) {
            departmentSelect.innerHTML = '<option value="">Sélectionnez votre Département</option>';
            departmentSelect.disabled = false;
            return;
        }

        fetch(`${departmentsApiUrl}?region_id=${regionId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(departments => {
                departmentSelect.innerHTML = '<option value="">Sélectionnez votre Département</option>';
                departments.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.id;
                    option.textContent = department.nom; // Utilisez 'nom' selon vos modèles Django
                    departmentSelect.appendChild(option);
                });
                departmentSelect.disabled = false;
            })
            .catch(error => {
                console.error('Erreur lors du chargement des départements:', error);
                departmentSelect.innerHTML = '<option value="">Erreur de chargement des départements</option>';
                departmentSelect.disabled = false;
            });
    }

    // Écouteur d'événement pour le changement de sélection de région
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            loadDepartments(this.value);
        });
    }

    // Charger les régions au chargement initial de la page
    loadRegions();
    // Désactiver le select des départements au début
    if (departmentSelect) {
        departmentSelect.disabled = true;
    }

    // Appel initial pour ajuster la hauteur quand la page est chargée
    setTimeout(updateContainerHeight, 100);
    // Ajoutez un écouteur pour le redimensionnement de la fenêtre pour ajuster la hauteur
    window.addEventListener('resize', updateContainerHeight);

    // Initial check for password match and button state on page load
    checkPasswordMatch();
});