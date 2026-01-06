/**
 * STORAGE.JS - Gerenciamento de Histórico
 * Calculadora EcoTransporte Brasil
 * Utiliza localStorage para persistência local de dados
 */

const STORAGE_KEY = 'ecotransporte_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Salva um cálculo no histórico
 */
function saveToHistory(calculationData) {
    try {
        // Adiciona timestamp
        const dataWithTimestamp = {
            ...calculationData,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        // Obtém histórico atual
        let history = getHistory();
        
        // Adiciona novo item no início
        history.unshift(dataWithTimestamp);
        
        // Limita ao número máximo de itens
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }
        
        // Salva no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        
        // Atualiza exibição
        displayHistory(history);
        
        console.log('✅ Cálculo salvo no histórico');
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar no histórico:', error);
        return false;
    }
}

/**
 * Recupera o histórico do localStorage
 */
function getHistory() {
    try {
        const historyJson = localStorage.getItem(STORAGE_KEY);
        if (!historyJson) {
            return [];
        }
        return JSON.parse(historyJson);
    } catch (error) {
        console.error('❌ Erro ao recuperar histórico:', error);
        return [];
    }
}

/**
 * Remove um item específico do histórico
 */
function removeFromHistory(index) {
    try {
        let history = getHistory();
        
        if (index >= 0 && index < history.length) {
            history.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            displayHistory(history);
            
            if (typeof showNotification === 'function') {
                showNotification('Item removido do histórico', 'success');
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Erro ao remover do histórico:', error);
        return false;
    }
}

/**
 * Limpa todo o histórico
 */
function clearHistory() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✅ Histórico limpo');
        
        if (typeof showNotification === 'function') {
            showNotification('Histórico limpo com sucesso', 'success');
        }
        return true;
    } catch (error) {
        console.error('❌ Erro ao limpar histórico:', error);
        return false;
    }
}

/**
 * Carrega e exibe o histórico na inicialização
 */
function loadHistoryFromStorage() {
    const history = getHistory();
    console.log(`📊 ${history.length} itens carregados do histórico`);
    
    if (typeof displayHistory === 'function') {
        displayHistory(history);
    }
}

/**
 * Exporta o histórico em formato JSON
 */
function exportHistory() {
    const history = getHistory();
    return JSON.stringify(history, null, 2);
}

/**
 * Importa histórico de um arquivo JSON
 */
function importHistory(jsonString) {
    try {
        const importedData = JSON.parse(jsonString);
        
        if (!Array.isArray(importedData)) {
            throw new Error('Formato inválido: esperado um array');
        }
        
        // Valida estrutura dos dados
        const isValid = importedData.every(item => 
            item.origin && 
            item.destination && 
            item.distance && 
            item.transport
        );
        
        if (!isValid) {
            throw new Error('Dados inválidos no arquivo');
        }
        
        // Mescla com histórico existente
        let currentHistory = getHistory();
        const mergedHistory = [...importedData, ...currentHistory];
        
        // Limita ao máximo
        const finalHistory = mergedHistory.slice(0, MAX_HISTORY_ITEMS);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalHistory));
        
        if (typeof displayHistory === 'function') {
            displayHistory(finalHistory);
        }
        
        if (typeof showNotification === 'function') {
            showNotification(`${importedData.length} itens importados com sucesso`, 'success');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao importar histórico:', error);
        
        if (typeof showNotification === 'function') {
            showNotification('Erro ao importar arquivo: ' + error.message, 'error');
        }
        
        return false;
    }
}

/**
 * Obtém estatísticas do histórico
 */
function getHistoryStats() {
    const history = getHistory();
    
    if (history.length === 0) {
        return {
            totalCalculations: 0,
            totalEmissions: 0,
            averageEmission: 0,
            mostUsedTransport: null,
            totalDistance: 0
        };
    }
    
    // Calcula estatísticas
    const totalEmissions = history.reduce((sum, item) => sum + (item.totalEmission || 0), 0);
    const totalDistance = history.reduce((sum, item) => sum + (item.distance || 0), 0);
    const averageEmission = totalEmissions / history.length;
    
    // Conta transportes mais usados
    const transportCount = {};
    history.forEach(item => {
        const transport = item.transport;
        transportCount[transport] = (transportCount[transport] || 0) + 1;
    });
    
    const mostUsedTransport = Object.keys(transportCount).reduce((a, b) => 
        transportCount[a] > transportCount[b] ? a : b
    );
    
    return {
        totalCalculations: history.length,
        totalEmissions: totalEmissions.toFixed(2),
        averageEmission: averageEmission.toFixed(2),
        mostUsedTransport,
        totalDistance: totalDistance.toFixed(0),
        transportDistribution: transportCount
    };
}

/**
 * Verifica se há espaço disponível no localStorage
 */
function checkStorageAvailability() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.error('❌ localStorage não disponível:', error);
        return false;
    }
}

/**
 * Obtém o tamanho aproximado do histórico em bytes
 */
function getHistorySize() {
    const historyJson = localStorage.getItem(STORAGE_KEY) || '[]';
    return new Blob([historyJson]).size;
}

/**
 * Busca no histórico por critérios
 */
function searchHistory(criteria) {
    const history = getHistory();
    
    return history.filter(item => {
        if (criteria.origin && item.origin !== criteria.origin) return false;
        if (criteria.destination && item.destination !== criteria.destination) return false;
        if (criteria.transport && item.transport !== criteria.transport) return false;
        if (criteria.minEmission && item.totalEmission < criteria.minEmission) return false;
        if (criteria.maxEmission && item.totalEmission > criteria.maxEmission) return false;
        if (criteria.startDate) {
            const itemDate = new Date(item.timestamp);
            const startDate = new Date(criteria.startDate);
            if (itemDate < startDate) return false;
        }
        if (criteria.endDate) {
            const itemDate = new Date(item.timestamp);
            const endDate = new Date(criteria.endDate);
            if (itemDate > endDate) return false;
        }
        return true;
    });
}

/**
 * Compara dois cálculos do histórico
 */
function compareHistoryItems(index1, index2) {
    const history = getHistory();
    
    if (index1 >= history.length || index2 >= history.length) {
        console.error('❌ Índices inválidos');
        return null;
    }
    
    const item1 = history[index1];
    const item2 = history[index2];
    
    const emissionDiff = item2.totalEmission - item1.totalEmission;
    const emissionDiffPercent = ((emissionDiff / item1.totalEmission) * 100).toFixed(1);
    
    return {
        item1,
        item2,
        emissionDifference: emissionDiff.toFixed(2),
        emissionDifferencePercent: emissionDiffPercent,
        moreEfficientOption: emissionDiff > 0 ? 'item1' : 'item2'
    };
}

// Verifica disponibilidade do localStorage ao carregar o script
if (!checkStorageAvailability()) {
    console.warn('⚠️ localStorage não disponível. O histórico não será salvo.');
}

// Log de informações do storage
console.log(`💾 Storage configurado: Máximo de ${MAX_HISTORY_ITEMS} itens`);
