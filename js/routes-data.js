// Dados de cidades e rotas pré-cadastradas

const CITIES = {
    'sao_paulo': { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
    'rio_janeiro': { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
    'belo_horizonte': { name: 'Belo Horizonte', lat: -19.9167, lng: -43.9345 },
    'brasilia': { name: 'Brasília', lat: -15.7801, lng: -47.9292 },
    'curitiba': { name: 'Curitiba', lat: -25.4284, lng: -49.2733 },
    'porto_alegre': { name: 'Porto Alegre', lat: -30.0346, lng: -51.2177 },
    'salvador': { name: 'Salvador', lat: -12.9714, lng: -38.5014 },
    'fortaleza': { name: 'Fortaleza', lat: -3.7172, lng: -38.5433 },
    'recife': { name: 'Recife', lat: -8.0476, lng: -34.8770 },
    'manaus': { name: 'Manaus', lat: -3.1190, lng: -60.0217 },
    'belem': { name: 'Belém', lat: -1.4558, lng: -48.4902 },
    'goiania': { name: 'Goiânia', lat: -16.6869, lng: -49.2648 },
    'campinas': { name: 'Campinas', lat: -22.9099, lng: -47.0626 },
    'santos': { name: 'Santos', lat: -23.9608, lng: -46.3333 },
    'florianopolis': { name: 'Florianópolis', lat: -27.5954, lng: -48.5480 }
};

const ROUTES = {
    'sao_paulo-rio_janeiro': 430,
    'sao_paulo-belo_horizonte': 586,
    'sao_paulo-brasilia': 1015,
    'sao_paulo-curitiba': 408,
    'rio_janeiro-belo_horizonte': 434,
    'rio_janeiro-brasilia': 1148,
    'brasilia-goiania': 209,
    'curitiba-porto_alegre': 711,
    'curitiba-florianopolis': 300,
    'salvador-recife': 800,
    'fortaleza-recife': 800,
    'manaus-belem': 1294
};

// Função para calcular distância usando fórmula de Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
}

// Obter distância entre duas cidades
function getRouteDistance(originId, destinationId) {
    const key1 = `${originId}-${destinationId}`;
    const key2 = `${destinationId}-${originId}`;
    
    if (ROUTES[key1]) return ROUTES[key1];
    if (ROUTES[key2]) return ROUTES[key2];
    
    // Calcular usando coordenadas
    const origin = CITIES[originId];
    const destination = CITIES[destinationId];
    if (origin && destination) {
        return calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    }
    
    return null;
}
