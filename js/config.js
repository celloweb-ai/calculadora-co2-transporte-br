// Configurações globais e constantes de emissão de CO₂

const CO2_EMISSIONS = {
    'bicicleta': { rate: 0.000, icon: '🚴', name: 'Bicicleta', color: '#4CAF50' },
    'carro_eletrico': { rate: 0.022, icon: '🔋', name: 'Carro Elétrico', color: '#8BC34A' },
    'trem': { rate: 0.035, icon: '🚆', name: 'Trem/Metrô', color: '#00BCD4' },
    'carro_hibrido': { rate: 0.051, icon: '🌱', name: 'Carro Híbrido', color: '#03A9F4' },
    'onibus': { rate: 0.075, icon: '🚌', name: 'Ônibus', color: '#2196F3' },
    'aviao': { rate: 0.123, icon: '✈️', name: 'Avião', color: '#FF9800' },
    'motocicleta': { rate: 0.130, icon: '🛟️', name: 'Motocicleta', color: '#FF5722' },
    'carro_gasolina': { rate: 0.148, icon: '🚗', name: 'Carro Gasolina', color: '#F44336' }
};

const ENVIRONMENTAL_EQUIVALENTS = {
    trees_year: 0.025, // kg CO2 absorvido por árvore/ano
    smartphone_charge: 0.008, // kg CO2 por carga completa
    kwh_energy: 0.475 // kg CO2 por kWh (média Brasil)
};

const CONFIG = {
    maxHistoryItems: 20,
    defaultPassengers: 1,
    defaultFrequency: 1,
    mapZoomLevel: 6,
    mapCenter: [-15.7801, -47.9292] // Brasília
};
