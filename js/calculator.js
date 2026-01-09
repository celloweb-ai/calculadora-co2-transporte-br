/**
 * CALCULATOR.JS - Lógica de Cálculo de Emissões de CO₂
 * Calculadora EcoTransporte Brasil
 */

/**
 * Função principal de cálculo (wrapper)
 * Compatibilidade com o app.js
 */
function calculateEmissions(params) {
    const {
        transport,
        distance,
        passengers = 1,
        frequency = 1,
        roundTrip = false,
        origin = '',
        destination = ''
    } = params;
    
    if (!transport || !distance) {
        console.error('❌ Parâmetros inválidos para cálculo');
        return null;
    }
    
    // Obtém dados do transporte
    const transportData = CO2_EMISSIONS[transport];
    if (!transportData) {
        console.error(`❌ Transporte inválido: ${transport}`);
        return null;
    }
    
    // Calcula distância total
    const tripMultiplier = roundTrip ? 2 : 1;
    const totalDistance = distance * tripMultiplier * frequency;
    
    // Calcula emissão base
    let totalEmission = transportData.rate * totalDistance;
    
    // Ajusta por passageiros (apenas para carros)
    if (transport.includes('carro') && passengers > 1) {
        totalEmission = totalEmission / passengers;
    }
    
    // Calcula comparação com outros transportes
    const comparison = compareAllTransports(distance, passengers, roundTrip, frequency);
    
    // Calcula equivalências ambientais
    const equivalents = calculateEnvironmentalEquivalents(totalEmission);
    
    // Determina nível de impacto
    const impact = getImpactLevel(totalEmission);
    
    // Gera recomendações
    const recommendations = generateRecommendations({
        transport,
        totalEmission,
        comparison,
        frequency,
        passengers
    });
    
    // Monta resultado completo
    const result = {
        // Dados da viagem
        origin: origin || 'N/A',
        destination: destination || 'N/A',
        distance,
        totalDistance,
        transport,
        transportName: transportData.name,
        passengers,
        frequency,
        roundTrip,
        
        // Emissões
        totalEmission: parseFloat(totalEmission.toFixed(3)),
        emissionRate: transportData.rate,
        emissionPerKm: parseFloat((totalEmission / totalDistance).toFixed(4)),
        
        // Análises
        comparison,
        equivalents,
        impact,
        recommendations,
        
        // Metadados
        timestamp: new Date().toISOString(),
        calculationId: Date.now()
    };
    
    console.log('✅ Cálculo realizado:', result);
    return result;
}

/**
 * Compara emissões com todos os tipos de transporte
 */
function compareAllTransports(distance, passengers, roundTrip, frequency) {
    const comparison = [];
    const totalDistance = distance * (roundTrip ? 2 : 1) * frequency;
    
    for (const [key, emission] of Object.entries(CO2_EMISSIONS)) {
        let co2 = emission.rate * totalDistance;
        
        // Ajusta por passageiros apenas para carros
        if (key.includes('carro') && passengers > 1) {
            co2 = co2 / passengers;
        }
        
        comparison.push({
            transport: key,
            name: emission.name,
            co2: parseFloat(co2.toFixed(3)),
            icon: emission.icon,
            color: emission.color,
            sustainability: emission.sustainability
        });
    }
    
    // Ordena do menor para o maior (mais sustentável primeiro)
    return comparison.sort((a, b) => a.co2 - b.co2);
}

/**
 * Calcula equivalências ambientais
 */
function calculateEnvironmentalEquivalents(co2Kg) {
    return {
        trees: {
            value: Math.ceil(co2Kg / ENVIRONMENTAL_EQUIVALENTS.trees_year),
            description: 'árvores necessárias para compensar (absorção anual)'
        },
        smartphones: {
            value: Math.ceil(co2Kg / ENVIRONMENTAL_EQUIVALENTS.smartphone_charge),
            description: 'cargas completas de smartphone'
        },
        energy: {
            value: parseFloat((co2Kg / ENVIRONMENTAL_EQUIVALENTS.kwh_energy).toFixed(2)),
            description: 'kWh de energia elétrica'
        },
        distance: {
            value: Math.round(co2Kg / 0.12),
            description: 'km rodados em carro médio'
        },
        flight: {
            value: parseFloat((co2Kg / 90).toFixed(2)),
            description: 'voos São Paulo-Rio de Janeiro'
        }
    };
}

/**
 * Determina o nível de impacto ambiental
 */
function getImpactLevel(co2Total) {
    if (co2Total < 5) {
        return {
            level: 'baixo',
            levelText: 'Baixo Impacto',
            color: '#4CAF50',
            icon: '😊',
            message: 'Excelente escolha! Sua viagem tem baixo impacto ambiental.',
            score: 10
        };
    } else if (co2Total < 20) {
        return {
            level: 'moderado',
            levelText: 'Impacto Moderado',
            color: '#FF9800',
            icon: '🤔',
            message: 'Impacto moderado. Há alternativas mais sustentáveis disponíveis.',
            score: 6
        };
    } else if (co2Total < 100) {
        return {
            level: 'alto',
            levelText: 'Alto Impacto',
            color: '#FF5722',
            icon: '⚠️',
            message: 'Alto impacto ambiental. Considere alternativas mais sustentáveis.',
            score: 3
        };
    } else {
        return {
            level: 'muito_alto',
            levelText: 'Impacto Muito Alto',
            color: '#F44336',
            icon: '🛑',
            message: 'Impacto ambiental muito alto! Recomendamos urgentemente avaliar alternativas.',
            score: 1
        };
    }
}

/**
 * Gera recomendações personalizadas
 */
function generateRecommendations(data) {
    const { transport, totalEmission, comparison, frequency, passengers } = data;
    const recommendations = [];
    
    // Encontra o transporte atual na comparação
    const currentIndex = comparison.findIndex(t => t.transport === transport);
    const betterOptions = comparison.slice(0, currentIndex);
    
    // Recomendação 1: Alternativa melhor
    if (betterOptions.length > 0) {
        const best = betterOptions[0];
        const savings = totalEmission - best.co2;
        const savingsPercent = Math.round((savings / totalEmission) * 100);
        
        recommendations.push({
            type: 'alternative',
            icon: '💡',
            title: 'Alternativa Mais Sustentável',
            message: `Usando ${best.name}, você economizaria ${savings.toFixed(2)} kg de CO₂ (${savingsPercent}%)`,
            priority: 'high'
        });
        
        // Segunda melhor opção
        if (betterOptions.length > 1) {
            const second = betterOptions[1];
            const savings2 = totalEmission - second.co2;
            const savingsPercent2 = Math.round((savings2 / totalEmission) * 100);
            
            recommendations.push({
                type: 'alternative',
                icon: '🌱',
                title: 'Segunda Opção Sustentável',
                message: `${second.name} também é uma boa opção: economia de ${savings2.toFixed(2)} kg CO₂ (${savingsPercent2}%)`,
                priority: 'medium'
            });
        }
    }
    
    // Recomendação 2: Projeção anual
    if (frequency > 1) {
        const yearlyTotal = (totalEmission / frequency) * 12;
        const monthlyAvg = totalEmission;
        
        recommendations.push({
            type: 'projection',
            icon: '📅',
            title: 'Projeção Anual',
            message: `Com essa frequência, você emitirá ${yearlyTotal.toFixed(2)} kg de CO₂ por ano (${monthlyAvg.toFixed(2)} kg/mês)`,
            priority: 'medium'
        });
    }
    
    // Recomendação 3: Compartilhamento de veículo
    if (transport.includes('carro') && passengers === 1) {
        const withTwoPassengers = totalEmission / 2;
        const savings = totalEmission - withTwoPassengers;
        
        recommendations.push({
            type: 'carpooling',
            icon: '🚗',
            title: 'Compartilhe o Carro',
            message: `Com mais 1 passageiro, a emissão per capita cai para ${withTwoPassengers.toFixed(2)} kg (economia de ${savings.toFixed(2)} kg)`,
            priority: 'high'
        });
    }
    
    // Recomendação 4: Compensação ambiental
    if (totalEmission > 10) {
        const treesNeeded = Math.ceil(totalEmission / 21);
        
        recommendations.push({
            type: 'compensation',
            icon: '🌳',
            title: 'Compense suas Emissões',
            message: `Considere plantar ${treesNeeded} árvore(s) ou participar de programas de compensação de carbono`,
            priority: 'low'
        });
    }
    
    // Recomendação 5: Tecnologia limpa
    if (transport === 'carro_gasolina') {
        const electricComparison = comparison.find(t => t.transport === 'carro_eletrico');
        if (electricComparison) {
            const savings = totalEmission - electricComparison.co2;
            
            recommendations.push({
                type: 'technology',
                icon: '⚡',
                title: 'Considere Veículo Elétrico',
                message: `Um carro elétrico reduziria suas emissões em ${savings.toFixed(2)} kg (${Math.round((savings/totalEmission)*100)}%)`,
                priority: 'medium'
            });
        }
    }
    
    return recommendations;
}

/**
 * Obtém ranking de sustentabilidade
 */
function getSustainabilityRanking(distance, passengers = 1) {
    const comparison = compareAllTransports(distance, passengers, false, 1);
    
    return comparison.map((item, index) => ({
        position: index + 1,
        medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`,
        ...item
    }));
}

/**
 * Valida parâmetros de entrada
 */
function validateCalculationParams(params) {
    const errors = [];
    
    if (!params.transport) errors.push('Transporte não especificado');
    if (!params.distance || params.distance <= 0) errors.push('Distância inválida');
    if (params.passengers && params.passengers < 1) errors.push('Número de passageiros inválido');
    if (params.frequency && params.frequency < 1) errors.push('Frequência inválida');
    
    return {
        valid: errors.length === 0,
        errors
    };
}

console.log('✅ Calculator.js carregado - Funções de cálculo disponíveis');

// Exporta funções para testes em ambiente Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateEmissions,
        compareAllTransports,
        calculateEnvironmentalEquivalents,
        getImpactLevel,
        generateRecommendations,
        getSustainabilityRanking,
        validateCalculationParams
    };
}
