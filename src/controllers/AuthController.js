function login(req,res){
    const {access_token} = req.body

    if (!access_token || access_token !== process.env.access_token){
        return res.status(401).json({erro: 'access_token invalido'})
    }

    req.session.autenticado = true;
    req.session.logadoEm = new Date().toISOString();
    res.status(200).json({ mensagem: 'sessão iniciada com sucesso' });
}

function perfil(req, res){
    res.status(200).json({
        autenticado: req.session.autenticado,
        logadoEm: req.session.logadoEm
    });
}

function logout(req,res){
    req.session.destroy((err) => {
        if (err){
            return req.status(500).json({erro: 'erro ao encerrar a sessão'})
        }
        res.clearCookie('connect.sid');
        res.status(200).json({mensagem: 'sessão encerrada'});
    });
}

module.exports = {login, logout, perfil}