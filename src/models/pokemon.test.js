const { validarDadosPokemon } = require('./pokemon');

//  toBe -> Igualdade estrita para valores simples.
//  toEqual -> Compara objetos/estruturas.
//  toHaveProperty -> Verifica propriedades no objeto.

test('accept function validarDadosPokemon', () => {
    expect(validarDadosPokemon({
        nome: 'bulbasaur', 
        tipo: 'alimentação'
    })).toEqual([]);
});

test('reject function validarDadosPokemon', () => {
    expect(validarDadosPokemon({
        nome: 'bulbasaur', 
        tipo: 30
    })).toEqual(['tipo é obrigatorio']);
});