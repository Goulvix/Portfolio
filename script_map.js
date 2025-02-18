// AccesToken
mapboxgl.accessToken = 'pk.eyJ1IjoiZ291bHZpeDM1IiwiYSI6ImNtNzM2NXJybTBqMTgyanF6cm83YzA3NDcifQ.8zCyY_QKmmsiMjYKII-Jrw';

// Configuration de la carte
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/goulvix35/cm736h2zf01q701s2buzxcu6h',
    zoom: 13,
    center: [-1.67, 48.11],
    pitch: 60,
    bearing: 0
});

// Variables pour suivre l'état des couches activées
let activeLayers = {
    Batiments: true,
    Metro: true
};

function goToHome() {
    window.location.href = "Portf2.html"; // Remplace par l'URL de ton accueil si différent
}


// Fonction pour ajouter les couches dynamiques
function addLayers() {
    // Vérifier si la couche existe déjà avant d'ajouter
    if (!map.getSource('Batiments')) {
        map.addSource('Batiments', {
            type: 'vector',
            url: 'mapbox://mastersigat.a4h4ovrl'
        });

        map.addLayer({
            'id': 'Batiments',
            'type': 'fill-extrusion',
            'source': 'Batiments',
            'source-layer': 'batiIGN-8zf03o',
            'layout': { 'visibility': activeLayers.Batiments ? 'visible' : 'none' },
            'paint': {
                'fill-extrusion-color': [
                    'interpolate', ['linear'], ['get', 'HAUTEUR'],
                    0, '#00FF00',
                    5, '#7FFF00',
                    15, '#FFFF00',
                    30, '#FFA500',
                    50, '#FF4500',
                    100, '#FF0000'
                ],
                'fill-extrusion-height': { 'type': 'identity', 'property': 'HAUTEUR' },
                'fill-extrusion-opacity': 0.9,
                'fill-extrusion-base': 0
            }
        });
    }

    // Ajout des lignes de métro
    if (!map.getSource('Metro')) {
        fetch('https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/metro-du-reseau-star-traces-de-laxe-des-lignes/records?limit=100')
            .then(response => response.json())
            .then(data => {
                const metroGeoJSON = {
                    type: 'FeatureCollection',
                    features: data.results.map(record => ({
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: record.geo_shape.geometry.coordinates
                        },
                        properties: {
                            ligne: record.ligne // Nom de la ligne
                        }
                    }))
                };

                map.addSource('Metro', {
                    type: 'geojson',
                    data: metroGeoJSON
                });

                map.addLayer({
                    'id': 'Metro',
                    'type': 'line',
                    'source': 'Metro',
                    'layout': { 'visibility': activeLayers.Metro ? 'visible' : 'none' },
                    'paint': {
                        'line-color': [
                            'match',
                            ['get', 'ligne'],
                            'a', '#c73636', // Rouge pour la ligne A
                            'b', '#3d734f', // Vert pour la ligne B
                            '#000000' // Noir par défaut si autre valeur
                        ],
                        'line-width': 3
                    }
                });
            })
            .catch(error => console.error('Erreur de chargement des données métro:', error));
    }
}

// Gestion du changement de style
document.getElementById('style-selector').addEventListener('change', function () {
    map.setStyle(this.value);
    map.once('styledata', addLayers); // Recharge les couches après changement de style
});

// Boutons de navigation
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

// Ajout Echelle cartographique
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'
}));

// Bouton de géolocalisation
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
}));

// Gestion des couches via les cases à cocher
document.getElementById('toggle-buildings').addEventListener('change', function () {
    activeLayers.Batiments = this.checked;
    map.setLayoutProperty('Batiments', 'visibility', activeLayers.Batiments ? 'visible' : 'none');
});

document.getElementById('toggle-metro').addEventListener('change', function () {
    activeLayers.Metro = this.checked;
    map.setLayoutProperty('Metro', 'visibility', activeLayers.Metro ? 'visible' : 'none');
});

// Chargement initial des couches
map.on('load', addLayers);
