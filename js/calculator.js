// Lógica de cálculo de emissões de CO₂

class CO2Calculator {
    constructor() {
        this.lastCalculation = null;
    }
    
    calculate(params) {
        const {
            transport,
            distance,
            passengers = 1,
            roundTrip = false,
            frequency = 1
        } = params;
        
        if (!CO2_EMISSIONS[transport]) {
            throw new Error('Transporte inválido');
        }
        
        const emission = CO2_EMISSIONS[transport];
        const totalDistance = distance * (roundTrip ? 2 : 1) * frequency;
        
        // Calcular emissão base
        let co2Total = emission.rate * totalDistance;
        
        // Dividir por passageiros para carros
        if (transport.includes('carro') && passengers > 1) {
            co2Total = co2Total / passengers;
        }
        
        // Calcular equivalências ambientais
        const equivalents = this.calculateEquivalents(co2Total);
        
        // Calcular comparação com todos os transportes
        const comparison = this.compareAllTransports(distance, passengers, roundTrip, frequency);
        
        this.lastCalculation = {
            transport: emission.name,
            transportKey: transport,
            distance,
            totalDistance,
            passengers,
            roundTrip,
            frequency,
            co2Total: parseFloat(co2Total.toFixed(3)),
            co2PerKm: emission.rate,
            equivalents,
            comparison,
            timestamp: new Date().toISOString()
        };
        
        return this.lastCalculation;
    }
    
    calculateEquivalents(co2Kg) {
        return {
            trees: Math.ceil(co2Kg / ENVIRONMENTAL_EQUIVALENTS.trees_year),
            smartphones: Math.ceil(co2Kg / ENVIRONMENTAL_EQUIVALENTS.smartphone_charge),
            energy: parseFloat((co2Kg / ENVIRONMENTAL_EQUIVALENTS.kwh_energy).toFixed(2))
        };
    }
    
    compareAllTransports(distance, passengers, roundTrip, frequency) {
        const comparison = [];
        const totalDistance = distance * (roundTrip ? 2 : 1) * frequency;
        
        for (const [key, emission] of Object.entries(CO2_EMISSIONS)) {
            let co2 = emission.rate * totalDistance;
            if (key.includes('carro') && passengers > 1) {
                co2 = co2 / passengers;
            }
            
            comparison.push({
                transport: emission.name,
                key: key,
                co2: parseFloat(co2.toFixed(3)),
                icon: emission.icon,
                color: emission.color
            });
        }
        
        return comparison.sort((a, b) => a.co2 - b.co2);
    }
    
    getImpactLevel(co2Total) {
        if (co2Total < 10) return { level: 'baixo', color: '#4CAF50', message: 'Excelente escolha! 🌱' };
        if (co2Total < 50) return { level: 'moderado', color: '#FF9800', message: 'Impacto moderado 🟡' };
        return { level: 'alto', color: '#F44336', message: 'Alto impacto! Considere alternativas 🔴' };
    }
    
    getRecommendations(calculation) {
        const impact = this.getImpactLevel(calculation.co2Total);
        const recommendations = [];
        
        // Encontrar alternativas melhores
        const currentIndex = calculation.comparison.findIndex(t => t.key === calculation.transportKey);
        const betterOptions = calculation.comparison.slice(0, currentIndex);
        
        if (betterOptions.length > 0) {
            const best = betterOptions[0];
            const savings = calculation.co2Total - best.co2;
            recommendations.push(
                `💡 Usando ${best.transport}, você economizaria ${savings.toFixed(2)} kg de CO₂ (${Math.round((savings/calculation.co2Total)*100)}%)`
            );
        }
        
        if (calculation.frequency > 1) {
            const yearlyTotal = (calculation.co2Total / calculation.frequency) * 12;
            recommendations.push(
                `📅 Projeção anual: ${yearlyTotal.toFixed(2)} kg de CO₂`
            );
        }
        
        if (calculation.transport.includes('Carro') && calculation.passengers === 1) {
            recommendations.push(
                `🚗 Considere compartilhar o carro - dividir com mais pessoas reduz muito a emissão per capita`
            );
        }
        
        return {
            impact,
            suggestions: recommendations
        };
    }
}

// Instância global
const calculator = new CO2Calculator();
