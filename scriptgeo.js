// scriptgeo.js

let map;  // Dichiara la mappa a livello globale
let currentMarker; // Variabile per tenere traccia del marker corrente

function initMap() {
    map = L.map('map').setView([0, 0], 2); // Coordinate iniziali (0, 0), zoom 2

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Prova a caricare la posizione salvata da localStorage
    loadSavedPosition();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, { enableHighAccuracy: true, timeout: 10000 }); // Aggiunto enableHighAccuracy e timeout
    } else {
        alert("Geolocalizzazione non supportata da questo browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("Latitudine:", latitude); // Aggiunto console.log
    console.log("Longitudine:", longitude); // Aggiunto console.log
    console.log("Precisione:", position.coords.accuracy); // Aggiunta la precisione

    // Centra la mappa sulla posizione dell'utente
    map.setView([latitude, longitude], 13);

    // Aggiungi o aggiorna il marker
    addOrUpdateMarker(latitude, longitude);

}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("L'utente ha rifiutato la richiesta di geolocalizzazione.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informazioni sulla posizione non disponibili.");
            break;
        case error.TIMEOUT:
            alert("Timeout nel tentativo di ottenere la posizione.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Si è verificato un errore sconosciuto.");
            break;
    }
}

function addOrUpdateMarker(latitude, longitude) {
    // Rimuovi il marker precedente, se esiste
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Crea un nuovo marker
    currentMarker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup("La tua posizione salvata!")
        .openPopup();

    // Salva la posizione in localStorage
    savePosition(latitude, longitude);
}

function savePosition(latitude, longitude) {
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
}

function loadSavedPosition() {
    const savedLatitude = localStorage.getItem('latitude');
    const savedLongitude = localStorage.getItem('longitude');

    if (savedLatitude && savedLongitude) {
        const latitude = parseFloat(savedLatitude);
        const longitude = parseFloat(savedLongitude);
        map.setView([latitude, longitude], 13);
        addOrUpdateMarker(latitude, longitude);
    } else {
        // Se non ci sono posizioni salvate, prova a ottenere la posizione dell'utente
        getLocation();
    }
}

// Gestore click sul pulsante
const saveLocationButton = document.getElementById('save-location');
saveLocationButton.addEventListener('click', () => {
    getLocation(); // Ottieni la posizione e centra la mappa su di essa
});

// Inizializza la mappa e carica la posizione salvata all'avvio
window.addEventListener('load', () => {
    initMap();
});