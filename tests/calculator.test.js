const { calculateEmissions } = require('../js/calculator');
const { CO2_EMISSIONS, ENVIRONMENTAL_EQUIVALENTS } = require('../js/config');

global.CO2_EMISSIONS = CO2_EMISSIONS;
global.ENVIRONMENTAL_EQUIVALENTS = ENVIRONMENTAL_EQUIVALENTS;

describe('calculateEmissions', () => {
    test('divide emissões por passageiros para carro gasolina com passageiros > 1', () => {
        const result = calculateEmissions({
            transport: 'carro_gasolina',
            distance: 100,
            passengers: 2,
            frequency: 1,
            roundTrip: false
        });

        expect(result.totalEmission).toBeCloseTo(7.4, 3);
    });

    test('não divide emissões por passageiros para transporte não-carro', () => {
        const result = calculateEmissions({
            transport: 'onibus',
            distance: 100,
            passengers: 3,
            frequency: 1,
            roundTrip: false
        });

        expect(result.totalEmission).toBeCloseTo(7.5, 3);
    });
});
