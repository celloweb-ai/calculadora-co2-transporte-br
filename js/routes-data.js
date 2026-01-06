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

// Mais de 100 rotas pré-cadastradas entre principais cidades brasileiras
const ROUTES = {
    // ROTAS PARTINDO DE SÃO PAULO
    'sao_paulo-rio_janeiro': 430,
    'sao_paulo-belo_horizonte': 586,
    'sao_paulo-brasilia': 1015,
    'sao_paulo-curitiba': 408,
    'sao_paulo-porto_alegre': 1109,
    'sao_paulo-salvador': 1962,
    'sao_paulo-fortaleza': 3127,
    'sao_paulo-recife': 2660,
    'sao_paulo-manaus': 3934,
    'sao_paulo-belem': 3250,
    'sao_paulo-goiania': 926,
    'sao_paulo-campinas': 96,
    'sao_paulo-santos': 72,
    'sao_paulo-florianopolis': 705,
    
    // ROTAS PARTINDO DO RIO DE JANEIRO
    'rio_janeiro-belo_horizonte': 434,
    'rio_janeiro-brasilia': 1148,
    'rio_janeiro-curitiba': 852,
    'rio_janeiro-porto_alegre': 1553,
    'rio_janeiro-salvador': 1649,
    'rio_janeiro-fortaleza': 2808,
    'rio_janeiro-recife': 2338,
    'rio_janeiro-manaus': 4378,
    'rio_janeiro-belem': 3250,
    'rio_janeiro-goiania': 1224,
    'rio_janeiro-campinas': 521,
    'rio_janeiro-santos': 490,
    'rio_janeiro-florianopolis': 1145,
    
    // ROTAS PARTINDO DE BELO HORIZONTE
    'belo_horizonte-brasilia': 716,
    'belo_horizonte-curitiba': 1004,
    'belo_horizonte-porto_alegre': 1712,
    'belo_horizonte-salvador': 1372,
    'belo_horizonte-fortaleza': 2527,
    'belo_horizonte-recife': 2075,
    'belo_horizonte-manaus': 3950,
    'belo_horizonte-belem': 2824,
    'belo_horizonte-goiania': 906,
    'belo_horizonte-campinas': 595,
    'belo_horizonte-santos': 860,
    'belo_horizonte-florianopolis': 1301,
    
    // ROTAS PARTINDO DE BRASÍLIA
    'brasilia-curitiba': 1366,
    'brasilia-porto_alegre': 2027,
    'brasilia-salvador': 1446,
    'brasilia-fortaleza': 2200,
    'brasilia-recife': 2200,
    'brasilia-manaus': 3490,
    'brasilia-belem': 2120,
    'brasilia-goiania': 209,
    'brasilia-campinas': 878,
    'brasilia-santos': 1290,
    'brasilia-florianopolis': 1673,
    
    // ROTAS PARTINDO DE CURITIBA
    'curitiba-porto_alegre': 711,
    'curitiba-salvador': 2528,
    'curitiba-fortaleza': 3770,
    'curitiba-recife': 3292,
    'curitiba-manaus': 4370,
    'curitiba-belem': 3682,
    'curitiba-goiania': 1254,
    'curitiba-campinas': 408,
    'curitiba-santos': 340,
    'curitiba-florianopolis': 300,
    
    // ROTAS PARTINDO DE PORTO ALEGRE
    'porto_alegre-salvador': 3236,
    'porto_alegre-fortaleza': 4374,
    'porto_alegre-recife': 3896,
    'porto_alegre-manaus': 4730,
    'porto_alegre-belem': 4193,
    'porto_alegre-goiania': 1965,
    'porto_alegre-campinas': 1044,
    'porto_alegre-santos': 1150,
    'porto_alegre-florianopolis': 476,
    
    // ROTAS PARTINDO DE SALVADOR
    'salvador-fortaleza': 1389,
    'salvador-recife': 800,
    'salvador-manaus': 3673,
    'salvador-belem': 2040,
    'salvador-goiania': 1571,
    'salvador-campinas': 2110,
    'salvador-santos': 2180,
    'salvador-florianopolis': 2826,
    
    // ROTAS PARTINDO DE FORTALEZA
    'fortaleza-recife': 800,
    'fortaleza-manaus': 4023,
    'fortaleza-belem': 1609,
    'fortaleza-goiania': 2315,
    'fortaleza-campinas': 3088,
    'fortaleza-santos': 3267,
    'fortaleza-florianopolis': 4068,
    
    // ROTAS PARTINDO DE RECIFE
    'recife-manaus': 4447,
    'recife-belem': 2133,
    'recife-goiania': 2315,
    'recife-campinas': 2620,
    'recife-santos': 2790,
    'recife-florianopolis': 3590,
    
    // ROTAS PARTINDO DE MANAUS
    'manaus-belem': 1294,
    'manaus-goiania': 3286,
    'manaus-campinas': 3880,
    'manaus-santos': 4020,
    'manaus-florianopolis': 4668,
    
    // ROTAS PARTINDO DE BELÉM
    'belem-goiania': 2015,
    'belem-campinas': 3042,
    'belem-santos': 3370,
    'belem-florianopolis': 3948,
    
    // ROTAS PARTINDO DE GOIÂNIA
    'goiania-campinas': 810,
    'goiania-santos': 1090,
    'goiania-florianopolis': 1561,
    
    // ROTAS PARTINDO DE CAMPINAS
    'campinas-santos': 136,
    'campinas-florianopolis': 609,
    
    // ROTAS PARTINDO DE SANTOS
    'santos-florianopolis': 633
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
    // Retorna null se origem e destino são iguais
    if (originId === destinationId) {
        return null;
    }
    
    const key1 = `${originId}-${destinationId}`;
    const key2 = `${destinationId}-${originId}`;
    
    // Verifica se existe rota pré-cadastrada
    if (ROUTES[key1]) return ROUTES[key1];
    if (ROUTES[key2]) return ROUTES[key2];
    
    // Calcular usando coordenadas (fallback)
    const origin = CITIES[originId];
    const destination = CITIES[destinationId];
    if (origin && destination) {
        return calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    }
    
    return null;
}

// Obter todas as rotas disponíveis de uma cidade
function getRoutesFromCity(cityId) {
    const routes = [];
    
    for (const [routeKey, distance] of Object.entries(ROUTES)) {
        const [origin, destination] = routeKey.split('-');
        
        if (origin === cityId) {
            routes.push({
                destination: CITIES[destination].name,
                destinationId: destination,
                distance
            });
        } else if (destination === cityId) {
            routes.push({
                destination: CITIES[origin].name,
                destinationId: origin,
                distance
            });
        }
    }
    
    return routes.sort((a, b) => a.distance - b.distance);
}

// Obter estatísticas das rotas
function getRouteStats() {
    const totalRoutes = Object.keys(ROUTES).length;
    const totalCities = Object.keys(CITIES).length;
    
    // Calcula possíveis combinações
    const possibleCombinations = (totalCities * (totalCities - 1)) / 2;
    
    // Distâncias
    const distances = Object.values(ROUTES);
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);
    const avgDistance = Math.round(distances.reduce((a, b) => a + b, 0) / distances.length);
    
    return {
        totalRoutes,
        totalCities,
        possibleCombinations,
        coveragePercent: Math.round((totalRoutes / possibleCombinations) * 100),
        minDistance,
        maxDistance,
        avgDistance
    };
}

// Log de informações ao carregar
console.log('🗺️ Sistema de Rotas Carregado');
console.log(`📍 ${Object.keys(CITIES).length} cidades cadastradas`);
console.log(`🛣️ ${Object.keys(ROUTES).length} rotas pré-configuradas`);

const stats = getRouteStats();
console.log(`📊 Cobertura: ${stats.coveragePercent}% das combinações possíveis`);
console.log(`📏 Distâncias: ${stats.minDistance}km (mín) a ${stats.maxDistance}km (máx)`);
