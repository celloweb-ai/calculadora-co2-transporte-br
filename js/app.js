/**
 * APP.JS - Inicialização e Gerenciamento de Eventos
 * Calculadora EcoTransporte Brasil
 */

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 Calculadora EcoTransporte Brasil - Inicializada');
    
    // Inicializa componentes
    initializeApp();
    setupEventListeners();
    loadHistoryFromStorage();
    
    // Preenche dropdowns de cidades
    populateCitySelects();
    
    // Inicializa mapa se disponível
    if (typeof initMap === 'function') {
        initMap();
    }
});

/**
 * Inicializa configurações da aplicação
 */
function initializeApp() {
    // Define ano atual no footer
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Configura valores padrão dos inputs
    document.getElementById('passengers').value = 1;
    document.getElementById('frequency').value = 1;
    document.getElementById('roundTrip').checked = false;
}

/**
 * Configura todos os event listeners da aplicação
 */
function setupEventListeners() {
    // Botão de cálculo
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculate);
    }
    
    // Seleção de transporte
    const transportCards = document.querySelectorAll('.transport-card');
    transportCards.forEach(card => {
        card.addEventListener('click', () => {
            transportCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const transportType = card.dataset.transport;
            document.getElementById('selectedTransport').value = transportType;
        });
    });
    
    // Mudança de origem/destino
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    
    if (originSelect && destinationSelect) {
        originSelect.addEventListener('change', updateRoute);
        destinationSelect.addEventListener('change', updateRoute);
    }
    
    // Limpar histórico
    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente limpar todo o histórico?')) {
                clearHistory();
                displayHistory([]);
            }
        });
    }
    
    // Exportar histórico
    const exportBtn = document.getElementById('exportHistory');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportHistoryToJSON);
    }
}

/**
 * Preenche os selects de origem e destino com as cidades disponíveis
 */
function populateCitySelects() {
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    
    if (!originSelect || !destinationSelect || typeof ROUTES === 'undefined') {
        return;
    }
    
    const cities = Object.keys(ROUTES).sort();
    
    cities.forEach(city => {
        const option1 = new Option(city, city);
        const option2 = new Option(city, city);
        originSelect.add(option1);
        destinationSelect.add(option2);
    });
    
    // Define valores padrão
    if (cities.length >= 2) {
        originSelect.value = cities[0];
        destinationSelect.value = cities[1];
        updateRoute();
    }
}

/**
 * Atualiza a distância quando origem/destino mudam
 */
function updateRoute() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const distanceInput = document.getElementById('distance');
    
    if (!origin || !destination || origin === destination) {
        distanceInput.value = '';
        return;
    }
    
    // Busca distância nas rotas pré-definidas
    if (typeof ROUTES !== 'undefined' && ROUTES[origin] && ROUTES[origin][destination]) {
        distanceInput.value = ROUTES[origin][destination];
    } else if (typeof ROUTES !== 'undefined' && ROUTES[destination] && ROUTES[destination][origin]) {
        distanceInput.value = ROUTES[destination][origin];
    } else {
        distanceInput.value = '';
    }
    
    // Atualiza mapa se disponível
    if (typeof updateMapRoute === 'function') {
        updateMapRoute(origin, destination);
    }
}

/**
 * Manipula o evento de cálculo
 */
function handleCalculate() {
    // Valida inputs
    const transport = document.getElementById('selectedTransport').value;
    const distance = parseFloat(document.getElementById('distance').value);
    const passengers = parseInt(document.getElementById('passengers').value) || 1;
    const frequency = parseInt(document.getElementById('frequency').value) || 1;
    const roundTrip = document.getElementById('roundTrip').checked;
    
    if (!transport) {
        showNotification('Por favor, selecione um meio de transporte', 'warning');
        return;
    }
    
    if (!distance || distance <= 0) {
        showNotification('Por favor, informe uma distância válida', 'warning');
        return;
    }
    
    // Calcula emissões
    const result = calculateEmissions({
        transport,
        distance,
        passengers,
        frequency,
        roundTrip,
        origin: document.getElementById('origin').value,
        destination: document.getElementById('destination').value
    });
    
    if (result) {
        // Exibe resultados
        displayResults(result);
        
        // Renderiza gráficos
        if (typeof renderCharts === 'function') {
            renderCharts(result);
        }
        
        // Salva no histórico
        if (typeof saveToHistory === 'function') {
            saveToHistory(result);
        }
        
        // Rola para os resultados
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
        showNotification('Cálculo realizado com sucesso!', 'success');
    }
}

/**
 * Exibe notificação para o usuário
 */
function showNotification(message, type = 'info') {
    // Cria elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Exporta histórico para JSON
 */
function exportHistoryToJSON() {
    const history = getHistory();
    if (!history || history.length === 0) {
        showNotification('Nenhum histórico disponível para exportar', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ecotransporte-historico-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Histórico exportado com sucesso!', 'success');
}

// Adiciona estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
