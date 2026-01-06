/**
 * CONFIG.JS - Configurações Globais e Constantes de Emissão de CO₂
 * Calculadora EcoTransporte Brasil
 * 
 * Taxas baseadas em dados científicos de:
 * - IPCC (Intergovernmental Panel on Climate Change)
 * - Ministério do Meio Ambiente (Brasil)
 * - DEFRA (UK Department for Environment, Food & Rural Affairs)
 * - Estudos acadêmicos sobre transporte brasileiro
 */

// Taxas de emissão em kg de CO₂ por km por passageiro
const CO2_EMISSIONS = {
    // Zero ou muito baixas emissões
    'bicicleta': {
        rate: 0.000,
        icon: '🚴',
        name: 'Bicicleta',
        color: '#4CAF50',
        sustainability: 'muito_alto',
        description: 'Zero emissões diretas de CO₂'
    },
    
    'carro_eletrico': {
        rate: 0.022,
        icon: '🔋',
        name: 'Carro Elétrico',
        color: '#8BC34A',
        sustainability: 'muito_alto',
        description: 'Considera mix energético brasileiro (hidreletricidade)'
    },
    
    // Transporte público eficiente
    'trem': {
        rate: 0.035,
        icon: '🚆',
        name: 'Trem/Metrô',
        color: '#00BCD4',
        sustainability: 'alto',
        description: 'Transporte elétrico de massa'
    },
    
    // Veículos híbridos
    'carro_hibrido': {
        rate: 0.051,
        icon: '🌱',
        name: 'Carro Híbrido',
        color: '#03A9F4',
        sustainability: 'alto',
        description: 'Motor elétrico + combustão'
    },
    
    // Transporte coletivo
    'onibus': {
        rate: 0.075,
        icon: '🚌',
        name: 'Ônibus',
        color: '#2196F3',
        sustainability: 'medio',
        description: 'Transporte coletivo urbano (diesel)'
    },
    
    // Aviação
    'aviao': {
        rate: 0.123,
        icon: '✈️',
        name: 'Avião',
        color: '#FF9800',
        sustainability: 'baixo',
        description: 'Voos domésticos (classe econômica)'
    },
    
    // Veículos individuais - combustível fóssil
    'motocicleta': {
        rate: 0.130,
        icon: '🏍️',
        name: 'Motocicleta',
        color: '#FF5722',
        sustainability: 'medio_baixo',
        description: 'Motocicletas 150-300cc (gasolina)'
    },
    
    'carro_gasolina': {
        rate: 0.148,
        icon: '🚗',
        name: 'Carro Gasolina',
        color: '#F44336',
        sustainability: 'muito_baixo',
        description: 'Veículo compacto 1.0-1.4L (gasolina/flex)'
    }
};

// Equivalências ambientais para contextualização das emissões
const ENVIRONMENTAL_EQUIVALENTS = {
    trees_year: 21.0,        // kg CO₂ absorvido por árvore adulta por ano (média)
    smartphone_charge: 0.008, // kg CO₂ por carga completa de smartphone
    kwh_energy: 0.0817,      // kg CO₂ por kWh (mix energético Brasil 2024)
    light_bulb_hour: 0.011,  // kg CO₂ por hora de lâmpada LED 10W
    plastic_bag: 0.010,      // kg CO₂ por sacola plástica produzida
    water_liter: 0.0003      // kg CO₂ por litro de água tratada
};

// Configurações gerais da aplicação
const CONFIG = {
    // Histórico
    maxHistoryItems: 50,
    
    // Valores padrão
    defaultPassengers: 1,
    defaultFrequency: 1,
    defaultRoundTrip: false,
    
    // Configurações do mapa
    mapZoomLevel: 4,
    mapCenter: [-15.7801, -47.9292], // Brasília (centro geográfico do Brasil)
    mapMaxZoom: 18,
    mapMinZoom: 3,
    
    // Limites de busca de cidade próxima (em km)
    citySearchRadius: 50,
    
    // Animações
    animationDuration: 300,
    chartAnimationDuration: 1000,
    
    // Formatação
    decimalPlaces: 2,
    distanceUnit: 'km',
    emissionUnit: 'kg CO₂',
    
    // Cores do tema
    theme: {
        primary: '#2ecc71',
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#e74c3c',
        info: '#3498db'
    },
    
    // Níveis de impacto ambiental
    impactLevels: {
        low: { max: 5, label: 'Baixo', color: '#4CAF50', icon: '😊' },
        moderate: { max: 20, label: 'Moderado', color: '#FF9800', icon: '🤔' },
        high: { max: 100, label: 'Alto', color: '#FF5722', icon: '⚠️' },
        very_high: { max: Infinity, label: 'Muito Alto', color: '#F44336', icon: '🛑' }
    }
};

// Informações sobre fontes de dados
const DATA_SOURCES = {
    emissions: [
        'IPCC Guidelines for National Greenhouse Gas Inventories',
        'DEFRA – Greenhouse gas reporting: conversion factors 2024',
        'Ministério do Meio Ambiente (Brasil)',
        'EPE - Empresa de Pesquisa Energética (Balanço Energético Nacional)'
    ],
    lastUpdate: '2026-01-06',
    version: '1.0.0'
};

// Métodos auxiliares
const UTILS = {
    /**
     * Formata número com casas decimais configuradas
     */
    formatNumber: (num) => {
        return parseFloat(num.toFixed(CONFIG.decimalPlaces));
    },
    
    /**
     * Formata emissão para exibição
     */
    formatEmission: (kg) => {
        if (kg === 0) return '0 g';
        if (kg < 0.001) return `${(kg * 1000000).toFixed(0)} mg`;
        if (kg < 1) return `${(kg * 1000).toFixed(0)} g`;
        if (kg < 1000) return `${kg.toFixed(CONFIG.decimalPlaces)} kg`;
        return `${(kg / 1000).toFixed(CONFIG.decimalPlaces)} t`;
    },
    
    /**
     * Formata distância para exibição
     */
    formatDistance: (km) => {
        if (km < 1) return `${(km * 1000).toFixed(0)} m`;
        return `${km.toFixed(CONFIG.decimalPlaces)} km`;
    },
    
    /**
     * Obtém nível de impacto baseado na emissão total
     */
    getImpactLevel: (totalEmission) => {
        for (const [level, config] of Object.entries(CONFIG.impactLevels)) {
            if (totalEmission <= config.max) {
                return { level, ...config };
            }
        }
        return CONFIG.impactLevels.very_high;
    }
};

console.log('✅ Config.js carregado - Versão', DATA_SOURCES.version);
console.log('📅 Última atualização dos dados:', DATA_SOURCES.lastUpdate);
console.log('🚗 Modais de transporte disponíveis:', Object.keys(CO2_EMISSIONS).length);
