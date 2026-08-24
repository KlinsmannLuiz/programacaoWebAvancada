const repository = require('../repositories/pokemonRepository')

const {
    listarPokemon,
    buscarPokemonPorID,
    criarPokemon,
    atualizarPokemons,
    deletarPokemon
} = require("./pokemonServices") 

jest.mock('../repositories/pokemonRepository') // não queremos que o teste realmente consulte o banco de dados.
beforeEach(() => { // antes de cada teste, o Jest limpa o histórico dos mocks. 
    jest.clearAllMocks();
});


test('deve listar todos os pokémons', () => {
    const pokemons = [
        {
            id: 1,
            nome: 'bulbasaur',
            tipo: 'alimentação'
        },
        {
            id: 2,
            nome: 'ivysaur',
            tipo: 'alimentação'
        }
    ];
    repository.listarPokemon.mockReturnValue(pokemons);

    const resultado = listarPokemon();

    expect(resultado).toEqual(pokemons);
    expect(repository.listarPokemon).toHaveBeenCalled();
});

test('deve buscar um pokémon pelo ID', () => {
    const pokemon = {
        id: 1,
        nome: 'bulbasaur',
        tipo: 'alimentação'
    };

    repository.buscarPokemonPorID.mockReturnValue(pokemon);

    const resultado = buscarPokemonPorID(1);

    expect(resultado).toEqual(pokemon);
    expect(repository.buscarPokemonPorID).toHaveBeenCalledWith(1);
});

test('deve lançar erro 404 quando o pokémon não existir', () => {
    repository.buscarPokemonPorID.mockReturnValue(undefined);

    expect(() => buscarPokemonPorID(999)).toThrow(
        'Pokemon não encontrado'
    );

    try {
        buscarPokemonPorID(999);
    } catch (erro) {
        expect(erro.status).toBe(404);
    }
});

test('deve criar um pokémon válido', () => {
    const pokemon = {
        nome: 'bulbasaur',
        tipo: 'alimentação'
    };

    const pokemonCriado = {
        id: 1,
        ...pokemon
    };

    repository.criarPokemon.mockReturnValue(pokemonCriado);

    const resultado = criarPokemon(pokemon);

    expect(resultado).toEqual(pokemonCriado);
    expect(repository.criarPokemon).toHaveBeenCalledWith(pokemon);
});

test('deve rejeitar a criação de um pokémon inválido', () => {
    const pokemon = {
        nome: 'bulbasaur',
        tipo: 30
    };

    expect(() => criarPokemon(pokemon)).toThrow(
        'tipo é obrigatorio'
    );

    expect(repository.criarPokemon).not.toHaveBeenCalled();
});

test('deve atualizar um pokémon existente', () => {
    const pokemon = {
        nome: 'bulbasaur',
        tipo: 'alimentação'
    };

    const pokemonAtualizado = {
        id: 1,
        ...pokemon
    };

    repository.buscarPokemonPorID.mockReturnValue(pokemonAtualizado);
    repository.atualizarPokemons.mockReturnValue(pokemonAtualizado);

    const resultado = atualizarPokemons(1, pokemon);

    expect(resultado).toEqual(pokemonAtualizado);
    expect(repository.atualizarPokemons).toHaveBeenCalledWith(1, pokemon);
});


test('não deve atualizar um pokémon inexistente', () => {
    repository.buscarPokemonPorID.mockReturnValue(undefined);

    expect(() => atualizarPokemons(999, {
        nome: 'bulbasaur',
        tipo: 'alimentação'
    })).toThrow('Pokemon não encontrado');

    expect(repository.atualizarPokemons).not.toHaveBeenCalled();
});

test('deve deletar um pokémon existente', () => {
    repository.buscarPokemonPorID.mockReturnValue({
        id: 1,
        nome: 'bulbasaur',
        tipo: 'alimentação'
    });

    deletarPokemon(1);

    expect(repository.deletarPokemon).toHaveBeenCalledWith(1);
});