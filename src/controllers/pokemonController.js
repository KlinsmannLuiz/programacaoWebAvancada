const services = require('../services/pokemonServices')

function listar(req, res){
    res.status(200).json(services.listarPokemon());
}

function buscar(req,res){
    try{
        res.status(200).json(services.buscarPokemonPorID(Number(req.params.id)));
    }catch (erro){
        res.status(erro.status || 500).json({
            "erro": erro.menssage
        })
    }
}

function criar(req,res){
    try{
        const pokemon = services.criarPokemon(req.body)
        res.status(201).json(pokemon);
    }catch (erro){
        res.status(erro.status || 500).json({
            "erro": erro.message
        })
    }
}

function atualizar(req,res){
    try{
        const pokemon = services.atualizarPokemons(Number(req.params.id), req.body)
        res.status(200).json(pokemon);
    }catch (erro){
        res.status(erro.status || 500).json({
            "erro": erro.message
        })
    }
}

function excluir(req,res){
    try{
        services.deletarPokemon(req.params.id);
        res.status(204).send();
    }catch (erro){
        res.status(erro.status || 500).json({
            "erro": erro.message
        })
    }
}

module.exports = {listar, buscar, criar, atualizar, excluir}