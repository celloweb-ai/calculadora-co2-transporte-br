/**
 * UI.JS - Manipulação do DOM e Interface
 * Calculadora EcoTransporte Brasil
 */

/**
 * Exibe os resultados do cálculo na interface
 */
function displayResults(result) {
    const resultsSection = document.getElementById('results');
    if (!resultsSection) return;
    
    resultsSection.style.display = 'block';
    
    // Atualiza informações principais
    updateMainResults(result);
    
    // Atualiza ranking de sustentabilidade
    updateRanking(result);
    
    // Atualiza equivalências ambientais
    updateEquivalences(result);
    
    // Atualiza recomendações
    updateRecommendations(result);
}

/**
 * Atualiza os resultados principais
 */
function updateMainResults(result) {
    // Emissão total
    const emissionElement = document.getElementById('totalEmission');
    if (emissionElement) {
        emissionElement.textContent = result.totalEmission.toFixed(2);
    }
    
    // Detalhes da viagem
    const detailsElement = document.getElementById('tripDetails');
    if (detailsElement) {
        const tripType = result.roundTrip ? 'Ida e Volta' : 'Somente Ida';
        const frequencyText = result.frequency > 1 ? `${result.frequency}x por mês` : 'Viagem única';
        
        detailsElement.innerHTML = `
            <div class="trip-detail">
                <strong>Rota:</strong> ${result.origin} → ${result.destination}
            </div>
            <div class="trip-detail">
                <strong>Distância:</strong> ${result.distance} km (${tripType})
            </div>
            <div class="trip-detail">
                <strong>Transporte:</strong> ${getTransportLabel(result.transport)}
            </div>
            <div class="trip-detail">
                <strong>Passageiros:</strong> ${result.passengers}
            </div>
            <div class="trip-detail">
                <strong>Frequência:</strong> ${frequencyText}
            </div>
        `;
    }
    
    // Emissão anual projetada
    const annualElement = document.getElementById('annualEmission');
    if (annualElement && result.frequency > 1) {
        const annualEmission = result.totalEmission * 12;
        annualElement.innerHTML = `
            <div class="annual-projection">
                <h3>Projeção Anual</h3>
                <p class="emission-value">${annualEmission.toFixed(2)} kg CO₂/ano</p>
                <p class="emission-detail">Baseado em ${result.frequency} viagens por mês</p>
            </div>
        `;
        annualElement.style.display = 'block';
    } else if (annualElement) {
        annualElement.style.display = 'none';
    }
}

/**
 * Atualiza o ranking de sustentabilidade
 */
function updateRanking(result) {
    const rankingElement = document.getElementById('sustainabilityRanking');
    if (!rankingElement || typeof TRANSPORT_EMISSIONS === 'undefined') return;
    
    // Calcula emissão para cada transporte
    const rankings = [];
    for (const [transport, emission] of Object.entries(TRANSPORT_EMISSIONS)) {
        const transportEmission = (emission * result.distance * (result.roundTrip ? 2 : 1)) / result.passengers;
        rankings.push({
            transport,
            emission: transportEmission,
            label: getTransportLabel(transport)
        });
    }
    
    // Ordena do menor para o maior (mais sustentável primeiro)
    rankings.sort((a, b) => a.emission - b.emission);
    
    // Renderiza ranking
    rankingElement.innerHTML = '<h3>🌿 Ranking de Sustentabilidade</h3>';
    const rankingList = document.createElement('div');
    rankingList.className = 'ranking-list';
    
    rankings.forEach((item, index) => {
        const rankItem = document.createElement('div');
        rankItem.className = `rank-item ${item.transport === result.transport ? 'current' : ''}`;
        
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`;
        
        rankItem.innerHTML = `
            <span class="rank-position">${medal}</span>
            <span class="rank-transport">${item.label}</span>
            <span class="rank-emission">${item.emission.toFixed(2)} kg CO₂</span>
        `;
        
        rankingList.appendChild(rankItem);
    });
    
    rankingElement.appendChild(rankingList);
}

/**
 * Atualiza as equivalências ambientais
 */
function updateEquivalences(result) {
    const equivalencesElement = document.getElementById('environmentalEquivalences');
    if (!equivalencesElement) return;
    
    const emission = result.totalEmission;
    
    // Cálculos de equivalências
    const trees = (emission / 21).toFixed(1); // Uma árvore absorve ~21kg CO2/ano
    const smartphones = (emission / 0.008).toFixed(0); // Carregar smartphone ~8g CO2
    const energy = (emission / 0.5).toFixed(1); // 1 kWh ≈ 0.5kg CO2
    const distance = (emission / 0.12).toFixed(0); // Carro médio ~0.12kg CO2/km
    
    equivalencesElement.innerHTML = `
        <h3>🌍 Equivalências Ambientais</h3>
        <div class="equivalences-grid">
            <div class="equivalence-card">
                <div class="equivalence-icon">🌳</div>
                <div class="equivalence-value">${trees}</div>
                <div class="equivalence-label">Árvores necessárias<br>(absorção anual)</div>
            </div>
            <div class="equivalence-card">
                <div class="equivalence-icon">📱</div>
                <div class="equivalence-value">${smartphones}</div>
                <div class="equivalence-label">Cargas completas<br>de smartphone</div>
            </div>
            <div class="equivalence-card">
                <div class="equivalence-icon">⚡</div>
                <div class="equivalence-value">${energy}</div>
                <div class="equivalence-label">kWh de energia<br>elétrica</div>
            </div>
            <div class="equivalence-card">
                <div class="equivalence-icon">🚗</div>
                <div class="equivalence-value">${distance}</div>
                <div class="equivalence-label">km rodados em<br>carro médio</div>
            </div>
        </div>
    `;
}

/**
 * Atualiza as recomendações baseadas no nível de emissão
 */
function updateRecommendations(result) {
    const recommendationsElement = document.getElementById('recommendations');
    if (!recommendationsElement) return;
    
    const emission = result.totalEmission;
    let level, icon, message, suggestions;
    
    // Define nível de impacto
    if (emission < 5) {
        level = 'low';
        icon = '😊';
        message = 'Excelente escolha! Sua viagem tem baixo impacto ambiental.';
        suggestions = [
            'Continue priorizando transportes sustentáveis',
            'Compartilhe sua experiência com outras pessoas',
            'Considere compensar as emissões plantando árvores'
        ];
    } else if (emission < 20) {
        level = 'moderate';
        icon = '🤔';
        message = 'Impacto moderado. Há alternativas mais sustentáveis disponíveis.';
        suggestions = [
            'Considere transporte público quando possível',
            'Compartilhe o carro com outras pessoas',
            'Avalie alternativas como trem ou ônibus',
            'Compense emissões com ações sustentáveis'
        ];
    } else {
        level = 'high';
        icon = '⚠️';
        message = 'Alto impacto ambiental. Recomendamos avaliar alternativas mais verdes.';
        suggestions = [
            'Priorize transporte público sempre que possível',
            'Para longas distâncias, considere trem em vez de avião',
            'Compartilhe viagens com outros passageiros',
            'Avalie a real necessidade da viagem (videoconferência?)',
            'Compense suas emissões com programas de reflorestamento'
        ];
    }
    
    recommendationsElement.innerHTML = `
        <div class="recommendation-box impact-${level}">
            <div class="recommendation-header">
                <span class="recommendation-icon">${icon}</span>
                <h3>Análise de Impacto: ${level === 'low' ? 'Baixo' : level === 'moderate' ? 'Moderado' : 'Alto'}</h3>
            </div>
            <p class="recommendation-message">${message}</p>
            <div class="recommendation-suggestions">
                <h4>Recomendações:</h4>
                <ul>
                    ${suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

/**
 * Retorna o label traduzido do transporte
 */
function getTransportLabel(transport) {
    const labels = {
        'bicycle': 'Bicicleta',
        'electric-car': 'Carro Elétrico',
        'train': 'Trem/Metrô',
        'hybrid-car': 'Carro Híbrido',
        'bus': 'Ônibus',
        'motorcycle': 'Motocicleta',
        'airplane': 'Avião',
        'car-flex': 'Carro Flex/Gasolina'
    };
    return labels[transport] || transport;
}

/**
 * Exibe o histórico de cálculos
 */
function displayHistory(history) {
    const historyElement = document.getElementById('historyList');
    if (!historyElement) return;
    
    if (!history || history.length === 0) {
        historyElement.innerHTML = '<p class="no-history">Nenhum cálculo realizado ainda.</p>';
        return;
    }
    
    historyElement.innerHTML = '';
    
    history.slice().reverse().forEach((item, index) => {
        const historyCard = document.createElement('div');
        historyCard.className = 'history-card';
        
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('pt-BR');
        const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        historyCard.innerHTML = `
            <div class="history-header">
                <span class="history-date">${dateStr} às ${timeStr}</span>
                <button class="history-delete" data-index="${history.length - 1 - index}" title="Remover">❌</button>
            </div>
            <div class="history-content">
                <div class="history-route">
                    <strong>${item.origin}</strong> → <strong>${item.destination}</strong>
                </div>
                <div class="history-details">
                    <span>${getTransportLabel(item.transport)}</span> • 
                    <span>${item.distance} km</span> • 
                    <span class="history-emission">${item.totalEmission.toFixed(2)} kg CO₂</span>
                </div>
            </div>
            <button class="history-recalculate" data-index="${history.length - 1 - index}">Recalcular</button>
        `;
        
        historyElement.appendChild(historyCard);
    });
    
    // Event listeners para botões do histórico
    document.querySelectorAll('.history-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeFromHistory(index);
        });
    });
    
    document.querySelectorAll('.history-recalculate').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            recalculateFromHistory(index);
        });
    });
}

/**
 * Recalcula usando dados do histórico
 */
function recalculateFromHistory(index) {
    const history = getHistory();
    if (!history || !history[index]) return;
    
    const item = history[index];
    
    // Preenche formulário
    document.getElementById('origin').value = item.origin;
    document.getElementById('destination').value = item.destination;
    document.getElementById('distance').value = item.distance;
    document.getElementById('passengers').value = item.passengers;
    document.getElementById('frequency').value = item.frequency;
    document.getElementById('roundTrip').checked = item.roundTrip;
    document.getElementById('selectedTransport').value = item.transport;
    
    // Seleciona card de transporte
    document.querySelectorAll('.transport-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.transport === item.transport) {
            card.classList.add('selected');
        }
    });
    
    // Rola para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showNotification('Dados do histórico carregados!', 'success');
}
