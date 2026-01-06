/**
 * MAPS.JS - Integração com Leaflet.js
 * Calculadora EcoTransporte Brasil
 */

let map = null;
let originMarker = null;
let destinationMarker = null;
let routeLine = null;
let markersGroup = null;

/**
 * Inicializa o mapa Leaflet
 */
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Cria o mapa centrado no Brasil
    map = L.map('map').setView([-15.7801, -47.9292], 4);

    // Adiciona camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 3
    }).addTo(map);

    // Cria grupo de marcadores
    markersGroup = L.layerGroup().addTo(map);

    // Adiciona controle de escala
    L.control.scale({
        imperial: false,
        metric: true
    }).addTo(map);

    // Event listener para cliques no mapa
    map.on('click', onMapClick);
}

/**
 * Manipula cliques no mapa
 */
function onMapClick(e) {
    const { lat, lng } = e.latlng;
    
    // Se não houver marcador de origem, cria um
    if (!originMarker) {
        setOriginMarker(lat, lng);
        showNotification('📍 Origem definida! Clique novamente para definir o destino.', 'info');
    } 
    // Senão, cria marcador de destino
    else if (!destinationMarker) {
        setDestinationMarker(lat, lng);
        calculateDistanceFromMarkers();
        showNotification('🎯 Destino definido! Distância calculada automaticamente.', 'success');
    }
    // Se ambos já existem, limpa e recomeça
    else {
        clearMapMarkers();
        setOriginMarker(lat, lng);
        showNotification('🔄 Marcadores resetados. Defina o novo destino.', 'info');
    }
}

/**
 * Define marcador de origem
 */
function setOriginMarker(lat, lng) {
    if (originMarker) {
        markersGroup.removeLayer(originMarker);
    }

    // Ícone personalizado de origem
    const originIcon = L.divIcon({
        className: 'custom-marker origin-marker',
        html: '<div class="marker-pin" style="background-color: #4CAF50;"><span>📍</span></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    originMarker = L.marker([lat, lng], {
        icon: originIcon,
        draggable: true,
        title: 'Origem (arraste para mover)'
    }).addTo(markersGroup);

    // Event listener para arrastar
    originMarker.on('dragend', function(e) {
        const position = e.target.getLatLng();
        if (destinationMarker) {
            calculateDistanceFromMarkers();
        }
    });

    // Popup com informações
    originMarker.bindPopup(`
        <div class="marker-popup">
            <strong>📍 Ponto de Origem</strong><br>
            Lat: ${lat.toFixed(4)}<br>
            Lng: ${lng.toFixed(4)}
        </div>
    `);
}

/**
 * Define marcador de destino
 */
function setDestinationMarker(lat, lng) {
    if (destinationMarker) {
        markersGroup.removeLayer(destinationMarker);
    }

    // Ícone personalizado de destino
    const destIcon = L.divIcon({
        className: 'custom-marker destination-marker',
        html: '<div class="marker-pin" style="background-color: #F44336;"><span>🎯</span></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    destinationMarker = L.marker([lat, lng], {
        icon: destIcon,
        draggable: true,
        title: 'Destino (arraste para mover)'
    }).addTo(markersGroup);

    // Event listener para arrastar
    destinationMarker.on('dragend', function(e) {
        const position = e.target.getLatLng();
        if (originMarker) {
            calculateDistanceFromMarkers();
        }
    });

    // Popup com informações
    destinationMarker.bindPopup(`
        <div class="marker-popup">
            <strong>🎯 Ponto de Destino</strong><br>
            Lat: ${lat.toFixed(4)}<br>
            Lng: ${lng.toFixed(4)}
        </div>
    `);
}

/**
 * Desenha linha de rota entre origem e destino
 */
function drawRouteLine() {
    if (!originMarker || !destinationMarker) return;

    // Remove linha anterior se existir
    if (routeLine) {
        markersGroup.removeLayer(routeLine);
    }

    const originLatLng = originMarker.getLatLng();
    const destLatLng = destinationMarker.getLatLng();

    // Cria linha pontilhada conectando os pontos
    routeLine = L.polyline(
        [originLatLng, destLatLng],
        {
            color: '#2196F3',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }
    ).addTo(markersGroup);

    // Ajusta zoom para mostrar ambos os pontos
    const bounds = L.latLngBounds([originLatLng, destLatLng]);
    map.fitBounds(bounds, { padding: [50, 50] });
}

/**
 * Calcula distância entre os marcadores usando fórmula de Haversine
 */
function calculateDistanceFromMarkers() {
    if (!originMarker || !destinationMarker) return;

    const origin = originMarker.getLatLng();
    const destination = destinationMarker.getLatLng();

    const distance = calculateHaversineDistance(
        origin.lat, origin.lng,
        destination.lat, destination.lng
    );

    // Atualiza campo de distância no formulário
    const distanceInput = document.getElementById('distance');
    if (distanceInput) {
        distanceInput.value = Math.round(distance);
    }

    // Desenha linha de rota
    drawRouteLine();

    // Mostra badge com distância
    showDistanceBadge(distance);
}

/**
 * Calcula distância usando fórmula de Haversine
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * Converte graus para radianos
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Mostra badge com distância calculada
 */
function showDistanceBadge(distance) {
    // Remove badge anterior se existir
    const existingBadge = document.querySelector('.distance-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // Cria novo badge
    const badge = document.createElement('div');
    badge.className = 'distance-badge';
    badge.innerHTML = `
        <div class="badge-content">
            <span class="badge-icon">📏</span>
            <span class="badge-text">${Math.round(distance)} km</span>
        </div>
    `;

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.appendChild(badge);
    }
}

/**
 * Marca cidades no mapa baseado em rotas pré-cadastradas
 */
function plotCitiesOnMap(cities) {
    if (!map || !cities) return;

    cities.forEach(city => {
        const marker = L.circleMarker([city.lat, city.lng], {
            radius: 6,
            fillColor: '#2196F3',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(markersGroup);

        marker.bindPopup(`
            <div class="city-popup">
                <strong>${city.name}</strong><br>
                ${city.state}<br>
                <small>Clique para usar como origem/destino</small>
            </div>
        `);

        // Event listener para selecionar cidade
        marker.on('click', function() {
            if (!originMarker) {
                setOriginMarker(city.lat, city.lng);
                document.getElementById('origin').value = city.name;
            } else if (!destinationMarker) {
                setDestinationMarker(city.lat, city.lng);
                document.getElementById('destination').value = city.name;
                calculateDistanceFromMarkers();
            }
        });
    });
}

/**
 * Limpa todos os marcadores e linhas do mapa
 */
function clearMapMarkers() {
    if (originMarker) {
        markersGroup.removeLayer(originMarker);
        originMarker = null;
    }
    if (destinationMarker) {
        markersGroup.removeLayer(destinationMarker);
        destinationMarker = null;
    }
    if (routeLine) {
        markersGroup.removeLayer(routeLine);
        routeLine = null;
    }

    // Remove badge de distância
    const badge = document.querySelector('.distance-badge');
    if (badge) {
        badge.remove();
    }

    // Reseta zoom
    map.setView([-15.7801, -47.9292], 4);
}

/**
 * Centraliza mapa em uma localização específica
 */
function centerMapOnLocation(lat, lng, zoom = 8) {
    if (!map) return;
    map.setView([lat, lng], zoom);
}

/**
 * Marca rota pré-definida no mapa
 */
function plotRoute(originCity, destCity, routes) {
    if (!map || !routes) return;

    clearMapMarkers();

    const origin = routes[originCity];
    const destination = routes[destCity];

    if (origin && destination) {
        setOriginMarker(origin.lat, origin.lng);
        setDestinationMarker(destination.lat, destination.lng);
        calculateDistanceFromMarkers();
    }
}

/**
 * Obtém localização atual do usuário
 */
function getUserLocation() {
    if (!navigator.geolocation) {
        showNotification('⚠️ Geolocalização não suportada pelo navegador.', 'error');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            centerMapOnLocation(lat, lng, 10);
            setOriginMarker(lat, lng);
            showNotification('📍 Localização atual definida como origem!', 'success');
        },
        function(error) {
            showNotification('⚠️ Erro ao obter localização: ' + error.message, 'error');
        }
    );
}

/**
 * Adiciona controle personalizado ao mapa
 */
function addMapControls() {
    if (!map) return;

    // Botão de localização atual
    const LocationControl = L.Control.extend({
        onAdd: function() {
            const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
            btn.innerHTML = '📍';
            btn.title = 'Usar minha localização';
            btn.style.backgroundColor = 'white';
            btn.style.width = '34px';
            btn.style.height = '34px';
            btn.style.fontSize = '18px';
            btn.style.cursor = 'pointer';
            btn.style.border = '2px solid rgba(0,0,0,0.2)';
            btn.style.borderRadius = '4px';

            btn.onclick = function() {
                getUserLocation();
            };

            return btn;
        }
    });

    new LocationControl({ position: 'topleft' }).addTo(map);

    // Botão de limpar marcadores
    const ClearControl = L.Control.extend({
        onAdd: function() {
            const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
            btn.innerHTML = '🗑️';
            btn.title = 'Limpar marcadores';
            btn.style.backgroundColor = 'white';
            btn.style.width = '34px';
            btn.style.height = '34px';
            btn.style.fontSize = '18px';
            btn.style.cursor = 'pointer';
            btn.style.border = '2px solid rgba(0,0,0,0.2)';
            btn.style.borderRadius = '4px';

            btn.onclick = function() {
                clearMapMarkers();
                document.getElementById('distance').value = '';
                showNotification('🧹 Marcadores removidos do mapa.', 'info');
            };

            return btn;
        }
    });

    new ClearControl({ position: 'topleft' }).addTo(map);
}

/**
 * Inicialização completa do sistema de mapas
 */
function initializeMapSystem() {
    initMap();
    addMapControls();
}
