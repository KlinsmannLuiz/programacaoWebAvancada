const  repository = require('../repositories/pokemonRepository')
const { validarDadosPokemon } = require('../models/pokemon');
const { render } = require('@testing-library/react');

function listarPokemon(){
    return repository.listarPokemon();
}

function buscarPokemonPorID(id){
    const pokemon = repository.buscarPokemonPorID(id)
    if(!pokemon){
        const erro = new Error("Pokemon não encontrado")
        erro.status = 404
        throw erro;
    }
    return pokemon;
}

function criarPokemon(dados){
    const erros = validarDadosPokemon(dados);
    if(erros.length > 0){
        const erro = new Error(erros.join(', '));
        erro.status = 400;
        throw erro;
    }
    return repository.criarPokemon(dados)
}

function atualizarPokemons(id, dados){
    buscarPokemonPorID(id)
    const erro = validarDadosPokemon(dados);
    if(erro.length > 0){
        const erro = new Error(erro.join(', '));
        erro.status(400)
        throw erro;
    }
    return repository.atualizarPokemons(id, dados)
}

function deletarPokemon(id){
    buscarPokemonPorID(id)
    repository.deletarPokemon(id);
}

module.exports = {
    listarPokemon, buscarPokemonPorID, criarPokemon, atualizarPokemons, deletarPokemon
};