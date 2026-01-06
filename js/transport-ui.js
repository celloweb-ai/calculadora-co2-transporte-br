/**
 * TRANSPORT-UI.JS - Geração Dinâmica dos Cards de Transporte
 * Calculadora EcoTransporte Brasil
 */

/**
 * Inicializa os cards de transporte
 */
function initializeTransportCards() {
    const transportGrid = document.getElementById('transportGrid');
    if (!transportGrid) return;
    
    const transports = [
        {
            id: 'bicycle',
            icon: '🚴',
            name: 'Bicicleta',
            emission: '0 g/km',
            sustainability: 'Muito Alto'
        },
        {
            id: 'electric-car',
            icon: '⚡',
            name: 'Carro Elétrico',
            emission: '0 g/km',
            sustainability: 'Muito Alto'
        },
        {
            id: 'train',
            icon: '🚆',
            name: 'Trem/Metrô',
            emission: '14 g/km',
            sustainability: 'Alto'
        },
        {
            id: 'hybrid-car',
            icon: '🚗',
            name: 'Carro Híbrido',
            emission: '80 g/km',
            sustainability: 'Médio'
        },
        {
            id: 'bus',
            icon: '🚌',
            name: 'Ônibus',
            emission: '89 g/km',
            sustainability: 'Médio'
        },
        {
            id: 'motorcycle',
            icon: '🏍️',
            name: 'Motocicleta',
            emission: '103 g/km',
            sustainability: 'Médio'
        },
        {
            id: 'car-flex',
            icon: '🚙',
            name: 'Carro Flex',
            emission: '192 g/km',
            sustainability: 'Baixo'
        },
        {
            id: 'airplane',
            icon: '✈️',
            name: 'Avião',
            emission: '255 g/km',
            sustainability: 'Muito Baixo'
        }
    ];
    
    transportGrid.innerHTML = '';
    
    transports.forEach(transport => {
        const card = document.createElement('div');
        card.className = 'transport-card';
        card.setAttribute('data-transport', transport.id);
        
        card.innerHTML = `
            <div class="transport-icon">${transport.icon}</div>
            <div class="transport-name">${transport.name}</div>
            <div class="transport-emission">${transport.emission}</div>
            <div class="transport-sustainability">${transport.sustainability}</div>
        `;
        
        card.addEventListener('click', () => selectTransport(transport.id));
        
        transportGrid.appendChild(card);
    });
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
    
    console.log('✓ Transporte selecionado:', transportId);
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTransportCards);
} else {
    initializeTransportCards();
}
