// ============================================
// MAPS.JS - Integração com Leaflet.js
// ============================================
// Módulo responsável por gerenciar mapas interativos
// para seleção de rotas e cálculo de distâncias

let map = null;
let originMarker = null;
let destinationMarker = null;
let routeLine = null;

/**
 * Inicializa o mapa com configurações padrão
 * @param {String} containerId - ID do elemento HTML do mapa
 */
function initializeMap(containerId = 'map') {
    if (map) {
        map.remove();
    }

    // Centro do Brasil (Brasília)
    const brazilCenter = [-15.7801, -47.9292];
    
    map = L.map(containerId, {
        center: brazilCenter,
        zoom: 4,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true
    });

    // Adicionar camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Adicionar controle de escala
    L.control.scale({
        imperial: false,
        metric: true
    }).addTo(map);

    return map;
}

/**
 * Adiciona marcador de origem no mapa
 * @param {Array} coordinates - [latitude, longitude]
 * @param {String} label - Rótulo do marcador
 */
function setOriginMarker(coordinates, label = 'Origem') {
    if (originMarker) {
        map.removeLayer(originMarker);
    }

    originMarker = L.marker(coordinates, {
        draggable: true,
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    originMarker.bindPopup(`<b>${label}</b>`).openPopup();

    // Evento ao arrastar marcador
    originMarker.on('dragend', function(e) {
        const newPos = e.target.getLatLng();
        updateRoute();
        if (typeof onMarkerDragEnd === 'function') {
            onMarkerDragEnd('origin', [newPos.lat, newPos.lng]);
        }
    });

    return originMarker;
}

/**
 * Adiciona marcador de destino no mapa
 * @param {Array} coordinates - [latitude, longitude]
 * @param {String} label - Rótulo do marcador
 */
function setDestinationMarker(coordinates, label = 'Destino') {
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
    }

    destinationMarker = L.marker(coordinates, {
        draggable: true,
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    destinationMarker.bindPopup(`<b>${label}</b>`).openPopup();

    // Evento ao arrastar marcador
    destinationMarker.on('dragend', function(e) {
        const newPos = e.target.getLatLng();
        updateRoute();
        if (typeof onMarkerDragEnd === 'function') {
            onMarkerDragEnd('destination', [newPos.lat, newPos.lng]);
        }
    });

    return destinationMarker;
}

/**
 * Desenha linha de rota entre origem e destino
 */
function updateRoute() {
    if (!originMarker || !destinationMarker) return;

    // Remover linha anterior
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    const originPos = originMarker.getLatLng();
    const destPos = destinationMarker.getLatLng();

    // Criar linha de rota
    routeLine = L.polyline(
        [[originPos.lat, originPos.lng], [destPos.lat, destPos.lng]],
        {
            color: '#2196F3',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
        }
    ).addTo(map);

    // Calcular distância
    const distance = calculateDistance(
        [originPos.lat, originPos.lng],
        [destPos.lat, destPos.lng]
    );

    // Adicionar popup com distância no meio da linha
    const midpoint = [
        (originPos.lat + destPos.lat) / 2,
        (originPos.lng + destPos.lng) / 2
    ];

    routeLine.bindPopup(`<b>Distância:</b> ${distance.toFixed(2)} km`);

    // Ajustar zoom para mostrar toda a rota
    const bounds = L.latLngBounds([originPos, destPos]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return distance;
}

/**
 * Calcula distância entre dois pontos usando fórmula de Haversine
 * @param {Array} coord1 - [latitude, longitude]
 * @param {Array} coord2 - [latitude, longitude]
 * @returns {Number} Distância em quilômetros
 */
function calculateDistance(coord1, coord2) {
    const R = 6371; // Raio da Terra em km
    const lat1 = coord1[0] * Math.PI / 180;
    const lat2 = coord2[0] * Math.PI / 180;
    const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const deltaLng = (coord2[1] - coord1[1]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * Define rota completa com origem e destino
 * @param {Object} origin - {coordinates: [lat, lng], name: string}
 * @param {Object} destination - {coordinates: [lat, lng], name: string}
 */
function setRoute(origin, destination) {
    if (!map) {
        initializeMap();
    }

    setOriginMarker(origin.coordinates, origin.name);
    setDestinationMarker(destination.coordinates, destination.name);
    
    return updateRoute();
}

/**
 * Limpa todos os marcadores e linhas do mapa
 */
function clearMap() {
    if (originMarker) {
        map.removeLayer(originMarker);
        originMarker = null;
    }
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
}

/**
 * Adiciona múltiplos marcadores ao mapa
 * @param {Array} locations - Array de objetos {coordinates, name, type}
 */
function addMultipleMarkers(locations) {
    const markers = [];
    
    locations.forEach(location => {
        const marker = L.marker(location.coordinates).addTo(map);
        marker.bindPopup(`<b>${location.name}</b>`);
        markers.push(marker);
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }

    return markers;
}

/**
 * Obtém coordenadas atuais dos marcadores
 * @returns {Object} {origin: [lat, lng], destination: [lat, lng]}
 */
function getMarkerCoordinates() {
    const result = {};
    
    if (originMarker) {
        const pos = originMarker.getLatLng();
        result.origin = [pos.lat, pos.lng];
    }
    
    if (destinationMarker) {
        const pos = destinationMarker.getLatLng();
        result.destination = [pos.lat, pos.lng];
    }
    
    return result;
}

/**
 * Centraliza mapa em coordenadas específicas
 * @param {Array} coordinates - [latitude, longitude]
 * @param {Number} zoom - Nível de zoom
 */
function centerMap(coordinates, zoom = 10) {
    if (map) {
        map.setView(coordinates, zoom);
    }
}

/**
 * Adiciona evento de clique no mapa
 * @param {Function} callback - Função a ser chamada no clique
 */
function onMapClick(callback) {
    if (map) {
        map.on('click', function(e) {
            callback([e.latlng.lat, e.latlng.lng]);
        });
    }
}

/**
 * Remove mapa da memória
 */
function destroyMap() {
    if (map) {
        map.remove();
        map = null;
        originMarker = null;
        destinationMarker = null;
        routeLine = null;
    }
}

// Exportar funções para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeMap,
        setOriginMarker,
        setDestinationMarker,
        updateRoute,
        calculateDistance,
        setRoute,
        clearMap,
        addMultipleMarkers,
        getMarkerCoordinates,
        centerMap,
        onMapClick,
        destroyMap
    };
}