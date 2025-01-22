// carrousel.js

// Sélectionne tous les carrousels sur la page
const carousels = document.querySelectorAll('.carousel');

// Pour chaque carrousel trouvé
carousels.forEach((carousel, index) => {
    const images = carousel.querySelectorAll('.carousel-image'); // Récupère toutes les images du carrousel
    let currentIndex = 0; // Commence par la première image

    // Affiche la première image
    images[currentIndex].classList.add('active');
    
    // Fonction pour afficher l'image suivante
    function showNextImage() {
        images[currentIndex].classList.remove('active'); // Cacher l'image actuelle
        currentIndex = (currentIndex + 1) % images.length; // Passer à l'image suivante (ou revenir à la première après la dernière)
        images[currentIndex].classList.add('active'); // Afficher la nouvelle image
    }

    // Fonction pour afficher l'image précédente
    function showPreviousImage() {
        images[currentIndex].classList.remove('active'); // Cacher l'image actuelle
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Passer à l'image précédente (ou revenir à la dernière après la première)
        images[currentIndex].classList.add('active'); // Afficher la nouvelle image
    }

    // Créer et ajouter les boutons de navigation gauche et droite
    const leftArrow = document.createElement('button');
    leftArrow.classList.add('carousel-arrow', 'left');
    leftArrow.innerHTML = '&#10094;'; // Symbole flèche gauche
    leftArrow.addEventListener('click', showPreviousImage); // Lorsqu'on clique, afficher l'image précédente

    const rightArrow = document.createElement('button');
    rightArrow.classList.add('carousel-arrow', 'right');
    rightArrow.innerHTML = '&#10095;'; // Symbole flèche droite
    rightArrow.addEventListener('click', showNextImage); // Lorsqu'on clique, afficher l'image suivante

    // Ajouter les flèches au carrousel
    carousel.appendChild(leftArrow);
    carousel.appendChild(rightArrow);

    // Ajouter un attribut data-index pour chaque carrousel afin de garder une trace de l'image actuelle
    carousel.setAttribute('data-index', currentIndex);
});

