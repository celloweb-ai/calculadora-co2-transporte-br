/**
 * CHARTS.JS - Renderização de Gráficos com Chart.js
 * Calculadora EcoTransporte Brasil
 */

let comparisonChart = null;
let evolutionChart = null;

/**
 * Função principal de renderização (wrapper)
 * Compatibilidade com app.js
 */
function renderCharts(result) {
    if (!result) {
        console.error('❌ Nenhum resultado para renderizar gráficos');
        return;
    }
    
    try {
        renderComparisonChart(result);
        renderEvolutionChart(result);
        console.log('✅ Gráficos renderizados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao renderizar gráficos:', error);
    }
}

/**
 * Renderiza o gráfico de comparação entre transportes
 */
function renderComparisonChart(result) {
    const canvas = document.getElementById('comparisonChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroi gráfico anterior se existir
    if (comparisonChart) {
        comparisonChart.destroy();
    }

    // Calcula emissões para cada transporte
    const transportData = [];
    const labels = [];
    const colors = [];
    const icons = [];

    for (const [key, config] of Object.entries(CO2_EMISSIONS)) {
        const emission = (config.rate * result.distance * (result.roundTrip ? 2 : 1)) / result.passengers;
        transportData.push(emission);
        labels.push(config.name);
        colors.push(config.color);
        icons.push(config.icon);
    }

    // Cria o gráfico de barras
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Emissões de CO₂ (kg)',
                data: transportData,
                backgroundColor: colors,
                borderColor: colors.map(c => c),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '📊 Comparação de Emissões por Transporte',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            return `${icons[index]} ${labels[index]}`;
                        },
                        label: function(context) {
                            return `Emissão: ${context.parsed.y.toFixed(2)} kg CO₂`;
                        },
                        afterLabel: function(context) {
                            const emission = context.parsed.y;
                            const trees = (emission / 21).toFixed(1);
                            return `≈ ${trees} árvores/ano necessárias`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kg CO₂',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + ' kg';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

/**
 * Renderiza o gráfico de evolução de emissões por distância
 */
function renderEvolutionChart(result) {
    const canvas = document.getElementById('evolutionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroi gráfico anterior se existir
    if (evolutionChart) {
        evolutionChart.destroy();
    }

    // Gera dados de evolução (0 a 500 km)
    const distances = [];
    const datasets = [];

    // Cria array de distâncias (0, 50, 100, ..., 500)
    for (let i = 0; i <= 500; i += 50) {
        distances.push(i);
    }

    // Seleciona transportes mais relevantes para comparação
    const selectedTransports = ['bicicleta', 'carro_eletrico', 'trem', 'onibus', 'carro_gasolina', 'aviao'];

    selectedTransports.forEach(transportKey => {
        const config = CO2_EMISSIONS[transportKey];
        const data = distances.map(d => {
            return (config.rate * d * (result.roundTrip ? 2 : 1)) / result.passengers;
        });

        datasets.push({
            label: config.name,
            data: data,
            borderColor: config.color,
            backgroundColor: config.color + '20',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: config.color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        });
    });

    // Cria o gráfico de linha
    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: distances,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '📈 Evolução de Emissões por Distância',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(context) {
                            return `Distância: ${context[0].label} km`;
                        },
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} kg CO₂`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Emissões de CO₂ (kg)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0) + ' kg';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Distância (km)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' km';
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

/**
 * Renderiza gráfico de pizza para distribuição de emissões
 */
function renderDistributionChart(history) {
    const canvas = document.getElementById('distributionChart');
    if (!canvas || !history || history.length === 0) return;

    const ctx = canvas.getContext('2d');

    // Agrupa emissões por transporte
    const transportEmissions = {};
    const transportColors = {};

    history.forEach(item => {
        const transportKey = Object.keys(CO2_EMISSIONS).find(key => 
            CO2_EMISSIONS[key].name === item.transport || key === item.transport
        );
        
        if (transportKey) {
            if (!transportEmissions[transportKey]) {
                transportEmissions[transportKey] = 0;
                transportColors[transportKey] = CO2_EMISSIONS[transportKey].color;
            }
            transportEmissions[transportKey] += item.totalEmission;
        }
    });

    const labels = Object.keys(transportEmissions).map(key => CO2_EMISSIONS[key].name);
    const data = Object.values(transportEmissions);
    const colors = Object.values(transportColors);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '🥧 Distribuição de Emissões por Transporte (Histórico)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value.toFixed(2)} kg CO₂ (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Atualiza todos os gráficos com novos dados
 */
function updateAllCharts(result) {
    renderComparisonChart(result);
    renderEvolutionChart(result);
}

/**
 * Limpa todos os gráficos
 */
function clearAllCharts() {
    if (comparisonChart) {
        comparisonChart.destroy();
        comparisonChart = null;
    }
    if (evolutionChart) {
        evolutionChart.destroy();
        evolutionChart = null;
    }
}

console.log('✅ Charts.js carregado - Funções de gráficos disponíveis');
