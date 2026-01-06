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
    
    // Botão salvar histórico
    const saveHistoryBtn = document.getElementById('saveHistory');
    if (saveHistoryBtn) {
        saveHistoryBtn.addEventListener('click', () => {
            showNotification('Cálculo salvo no histórico!', 'success');
        });
    }
}

/**
 * Preenche os selects de origem e destino com as cidades disponíveis
 */
function populateCitySelects() {
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    
    if (!originSelect || !destinationSelect || typeof CITIES === 'undefined') {
        console.error('❌ Erro: Elementos de cidade ou dados CITIES não encontrados');
        return;
    }
    
    // Cria array de cidades ordenado por nome
    const citiesArray = Object.entries(CITIES)
        .map(([id, data]) => ({ id, name: data.name }))
        .sort((a, b) => a.name.localeCompare('pt-BR'));
    
    console.log('✅ Carregadas', citiesArray.length, 'cidades');
    
    // Preenche os selects
    citiesArray.forEach(city => {
        const option1 = new Option(city.name, city.id);
        const option2 = new Option(city.name, city.id);
        originSelect.add(option1);
        destinationSelect.add(option2);
    });
    
    // Define valores padrão (São Paulo → Rio de Janeiro)
    if (citiesArray.length >= 2) {
        originSelect.value = 'sao_paulo';
        destinationSelect.value = 'rio_janeiro';
        updateRoute();
    }
}

/**
 * Atualiza a distância quando origem/destino mudam
 */
function updateRoute() {
    const originId = document.getElementById('origin').value;
    const destinationId = document.getElementById('destination').value;
    const distanceInput = document.getElementById('distance');
    
    if (!originId || !destinationId || originId === destinationId) {
        distanceInput.value = '';
        return;
    }
    
    // Busca distância usando a função do routes-data.js
    if (typeof getRouteDistance === 'function') {
        const distance = getRouteDistance(originId, destinationId);
        if (distance) {
            distanceInput.value = distance;
            console.log(`📍 Rota: ${CITIES[originId].name} → ${CITIES[destinationId].name} = ${distance} km`);
        } else {
            distanceInput.value = '';
            console.warn('⚠️ Distância não encontrada, insira manualmente');
        }
    }
    
    // Atualiza mapa se disponível
    if (typeof updateMapRoute === 'function') {
        updateMapRoute(originId, destinationId);
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
    const originId = document.getElementById('origin').value;
    const destinationId = document.getElementById('destination').value;
    
    if (!transport) {
        showNotification('Por favor, selecione um meio de transporte', 'warning');
        return;
    }
    
    if (!distance || distance <= 0) {
        showNotification('Por favor, informe uma distância válida', 'warning');
        return;
    }
    
    if (!originId || !destinationId) {
        showNotification('Por favor, selecione origem e destino', 'warning');
        return;
    }
    
    // Calcula emissões
    const result = calculateEmissions({
        transport,
        distance,
        passengers,
        frequency,
        roundTrip,
        origin: CITIES[originId].name,
        destination: CITIES[destinationId].name
    });
    
    if (result) {
        // Exibe resultados
        displayResults(result);
        
        // Renderiza gráficos
        if (typeof renderCharts === 'function') {
            renderCharts(result);
        }
        
        // Salva no histórico automaticamente
        if (typeof saveToHistory === 'function') {
            saveToHistory(result);
            loadHistoryFromStorage();
        }
        
        // Rola para os resultados
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        showNotification('✅ Cálculo realizado com sucesso!', 'success');
    }
}

/**
 * Carrega histórico do storage e exibe
 */
function loadHistoryFromStorage() {
    if (typeof getHistory === 'function' && typeof displayHistory === 'function') {
        const history = getHistory();
        displayHistory(history);
        console.log('📚 Histórico carregado:', history.length, 'itens');
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
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
    
    showNotification('📥 Histórico exportado com sucesso!', 'success');
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
