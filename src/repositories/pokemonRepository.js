const db = require("../config/database")

function listarPokemon(){
    return db.prepare('SELECT * FROM pokemons ORDER BY id').all();
}

function buscarPokemonPorID(id){
    return db.prepare('SELECT * FROM pokemons WHERE pokemons.id = ?').get(id);
}

function criarPokemon({nome, tipo}){
    const resultado = db
    .prepare("INSERT INTO pokemons (nome, tipo) VALUES(?,?)")
    .run(nome, tipo)
    return buscarPokemonPorID(resultado.lastInsertRowid)
}

function atualizarPokemons(id,{nome, tipo}){
    db.prepare('UPDATE pokemons SET nome = ?, tipo = ? WHERE pokemons.id = ?').run(nome,tipo,id)
    return buscarPokemonPorID(id);
}

function deletarPokemon(id){
    const resulado = db.prepare('DELETE FROM pokemons WHERE pokemons.id = ?').run(id);
    return resulado.changes > 0;
}



module.exports = {listarPokemon, buscarPokemonPorID, criarPokemon, atualizarPokemons, listarPokemon, deletarPokemon}