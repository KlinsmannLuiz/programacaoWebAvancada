function validarDadosPokemon({nome, tipo}){
    const ERROS = []
    if(!nome || typeof nome !== 'string' || nome.trim().length === 0){
        ERROS.push('O campo nome é obrigatorio')
    }
    if(!tipo || typeof tipo !== 'string' || tipo.trim().length === 0){
        ERROS.push('tipo é obrigatorio')
    }

    return ERROS;
}

module.exports = { validarDadosPokemon };
