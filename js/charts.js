// ============================================
// CHARTS.JS - Renderização de Gráficos
// ============================================
// Módulo responsável por criar e gerenciar visualizações
// de dados usando Chart.js para comparação de emissões

/**
 * Renderiza gráfico de comparação entre diferentes transportes
 * @param {Array} transportData - Array de objetos com {name, emission, color}
 */
function renderComparisonChart(transportData) {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (window.comparisonChartInstance) {
        window.comparisonChartInstance.destroy();
    }

    // Ordenar por emissão (do menor para o maior)
    const sortedData = [...transportData].sort((a, b) => a.emission - b.emission);

    window.comparisonChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(t => t.name),
            datasets: [{
                label: 'Emissões de CO₂ (kg)',
                data: sortedData.map(t => t.emission),
                backgroundColor: sortedData.map(t => t.color || '#4CAF50'),
                borderColor: sortedData.map(t => t.color || '#388E3C'),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Comparação de Emissões por Transporte',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(2)} kg CO₂`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Emissões (kg CO₂)'
                    }
                }
            }
        }
    });
}

/**
 * Renderiza gráfico de evolução de emissões por distância
 * @param {Object} transportType - Tipo de transporte selecionado
 * @param {Number} maxDistance - Distância máxima para projeção
 */
function renderEvolutionChart(transportType, maxDistance = 1000) {
    const ctx = document.getElementById('evolutionChart');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (window.evolutionChartInstance) {
        window.evolutionChartInstance.destroy();
    }

    // Gerar dados de projeção
    const distances = [];
    const emissions = [];
    const step = maxDistance / 10;

    for (let i = 0; i <= maxDistance; i += step) {
        distances.push(i);
        emissions.push(i * transportType.emissionPerKm);
    }

    window.evolutionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: distances.map(d => `${Math.round(d)} km`),
            datasets: [{
                label: `${transportType.name} - Emissões`,
                data: emissions,
                borderColor: transportType.color || '#2196F3',
                backgroundColor: transportType.color ? `${transportType.color}33` : '#2196F333',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Projeção de Emissões por Distância',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(2)} kg CO₂`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Emissões (kg CO₂)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Distância'
                    }
                }
            }
        }
    });
}

/**
 * Renderiza gráfico de pizza para distribuição percentual
 * @param {Array} transportData - Array de objetos com emissões
 */
function renderPieChart(transportData) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    // Filtrar apenas transportes com emissão > 0
    const validData = transportData.filter(t => t.emission > 0);
    
    window.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: validData.map(t => t.name),
            datasets: [{
                data: validData.map(t => t.emission),
                backgroundColor: validData.map(t => t.color || '#4CAF50'),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Distribuição de Emissões',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed.toFixed(2)} kg (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Renderiza gráfico de ranking de sustentabilidade
 * @param {Array} transportData - Array de objetos com emissões
 */
function renderRankingChart(transportData) {
    const ctx = document.getElementById('rankingChart');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (window.rankingChartInstance) {
        window.rankingChartInstance.destroy();
    }

    // Ordenar do mais sustentável para o menos
    const sortedData = [...transportData].sort((a, b) => a.emission - b.emission);

    // Cores do verde (melhor) ao vermelho (pior)
    const colors = sortedData.map((_, index) => {
        const ratio = index / (sortedData.length - 1);
        const r = Math.round(ratio * 220);
        const g = Math.round((1 - ratio) * 180);
        return `rgb(${r}, ${g}, 50)`;
    });

    window.rankingChartInstance = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: sortedData.map(t => t.name),
            datasets: [{
                label: 'Ranking de Sustentabilidade',
                data: sortedData.map(t => t.emission),
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('rgb', 'rgba').replace(')', ', 0.8)')),
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Ranking de Sustentabilidade (Menor = Melhor)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x.toFixed(2)} kg CO₂`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Emissões (kg CO₂)'
                    }
                }
            }
        }
    });
}

/**
 * Limpa todos os gráficos ativos
 */
function clearAllCharts() {
    if (window.comparisonChartInstance) {
        window.comparisonChartInstance.destroy();
        window.comparisonChartInstance = null;
    }
    if (window.evolutionChartInstance) {
        window.evolutionChartInstance.destroy();
        window.evolutionChartInstance = null;
    }
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
        window.pieChartInstance = null;
    }
    if (window.rankingChartInstance) {
        window.rankingChartInstance.destroy();
        window.rankingChartInstance = null;
    }
}

// Exportar funções para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderComparisonChart,
        renderEvolutionChart,
        renderPieChart,
        renderRankingChart,
        clearAllCharts
    };
}