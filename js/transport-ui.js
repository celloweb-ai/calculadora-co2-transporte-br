/**
 * TRANSPORT-UI.JS - Geração Dinâmica dos Cards de Transporte
 * Calculadora EcoTransporte Brasil
 */

/**
 * Inicializa os cards de transporte com dados corretos do config.js
 */
function initializeTransportCards() {
    const transportGrid = document.getElementById('transportGrid');
    if (!transportGrid || typeof CO2_EMISSIONS === 'undefined') {
        console.error('❌ Erro: Elemento transportGrid ou CO2_EMISSIONS não encontrado');
        return;
    }
    
    // Mapeamento de IDs para os dados do CO2_EMISSIONS
    const transportMapping = {
        'bicicleta': {
            id: 'bicicleta',
            name: 'Bicicleta',
            description: 'Zero emissões',
            sustainability: '🌿 Muito Alto'
        },
        'carro_eletrico': {
            id: 'carro_eletrico',
            name: 'Carro Elétrico',
            description: 'Energia limpa',
            sustainability: '🌿 Muito Alto'
        },
        'trem': {
            id: 'trem',
            name: 'Trem/Metrô',
            description: 'Transporte eficiente',
            sustainability: '🌿 Alto'
        },
        'carro_hibrido': {
            id: 'carro_hibrido',
            name: 'Carro Híbrido',
            description: 'Motor duplo',
            sustainability: '🌱 Alto'
        },
        'onibus': {
            id: 'onibus',
            name: 'Ônibus',
            description: 'Transporte coletivo',
            sustainability: '🌱 Médio'
        },
        'aviao': {
            id: 'aviao',
            name: 'Avião',
            description: 'Longas distâncias',
            sustainability: '⚠️ Baixo'
        },
        'motocicleta': {
            id: 'motocicleta',
            name: 'Motocicleta',
            description: 'Transporte individual',
            sustainability: '⚠️ Médio-Baixo'
        },
        'carro_gasolina': {
            id: 'carro_gasolina',
            name: 'Carro Gasolina',
            description: 'Combustível fóssil',
            sustainability: '🛑 Muito Baixo'
        }
    };
    
    transportGrid.innerHTML = '';
    
    // Cria cards baseados nos dados do CO2_EMISSIONS
    for (const [key, data] of Object.entries(CO2_EMISSIONS)) {
        const mapping = transportMapping[key];
        if (!mapping) continue;
        
        const card = document.createElement('div');
        card.className = 'transport-card';
        card.setAttribute('data-transport', key);
        
        // Converte taxa de kg/km para g/km para exibição
        const emissionGrams = (data.rate * 1000).toFixed(0);
        const emissionDisplay = emissionGrams === '0' ? '0 g/km' : `${emissionGrams} g/km`;
        
        card.innerHTML = `
            <div class="transport-icon" style="font-size: 2.5rem;">${data.icon}</div>
            <div class="transport-name" style="font-weight: 600; margin: 8px 0;">${data.name}</div>
            <div class="transport-emission" style="color: ${data.color}; font-weight: 700; font-size: 1.1rem;">${emissionDisplay}</div>
            <div class="transport-sustainability" style="font-size: 0.85rem; margin-top: 4px; color: #666;">${mapping.sustainability}</div>
        `;
        
        card.addEventListener('click', () => selectTransport(key));
        
        transportGrid.appendChild(card);
    }
    
    console.log('✅', Object.keys(CO2_EMISSIONS).length, 'cards de transporte gerados');
}

/**
 * Seleciona um transporte
 */
function selectTransport(transportId) {
    // Remove seleção anterior
    document.querySelectorAll('.transport-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adiciona seleção ao card clicado
    const selectedCard = document.querySelector(`[data-transport="${transportId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Atualiza campo oculto
    const selectedTransportInput = document.getElementById('selectedTransport');
    if (selectedTransportInput) {
        selectedTransportInput.value = transportId;
    }
    
    // Obtém nome do transporte para notificação
    const transportName = CO2_EMISSIONS[transportId]?.name || transportId;
    
    // Exibe notificação visual
    if (typeof showNotification === 'function') {
        showNotification(`✅ ${transportName} selecionado`, 'success');
    }
    
    console.log('✅ Transporte selecionado:', transportId, '-', transportName);
}

/**
 * Retorna informações detalhadas de um transporte
 */
function getTransportInfo(transportId) {
    if (typeof CO2_EMISSIONS === 'undefined' || !CO2_EMISSIONS[transportId]) {
        return null;
    }
    
    const data = CO2_EMISSIONS[transportId];
    const emissionGrams = (data.rate * 1000).toFixed(0);
    
    return {
        id: transportId,
        name: data.name,
        icon: data.icon,
        color: data.color,
        rate: data.rate,
        emissionGrams: emissionGrams,
        emissionDisplay: emissionGrams === '0' ? 'Zero emissões' : `${emissionGrams} g CO₂/km`
    };
}

/**
 * Obtém o card de transporte mais sustentável
 */
function getMostSustainableTransport() {
    if (typeof CO2_EMISSIONS === 'undefined') return null;
    
    let minRate = Infinity;
    let bestTransport = null;
    
    for (const [key, data] of Object.entries(CO2_EMISSIONS)) {
        if (data.rate < minRate) {
            minRate = data.rate;
            bestTransport = key;
        }
    }
    
    return bestTransport;
}

/**
 * Obtém o card de transporte menos sustentável
 */
function getLeastSustainableTransport() {
    if (typeof CO2_EMISSIONS === 'undefined') return null;
    
    let maxRate = -Infinity;
    let worstTransport = null;
    
    for (const [key, data] of Object.entries(CO2_EMISSIONS)) {
        if (data.rate > maxRate) {
            maxRate = data.rate;
            worstTransport = key;
        }
    }
    
    return worstTransport;
}

/**
 * Destaca o transporte mais sustentável
 */
function highlightSustainableOption() {
    const bestTransport = getMostSustainableTransport();
    if (!bestTransport) return;
    
    const card = document.querySelector(`[data-transport="${bestTransport}"]`);
    if (card) {
        card.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
        card.style.border = '3px solid #4CAF50';
    }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTransportCards);
} else {
    initializeTransportCards();
}

console.log('✅ Transport-UI.js carregado');
