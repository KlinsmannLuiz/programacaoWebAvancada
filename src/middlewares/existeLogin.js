function exigeLogin(req, res, next) {
    if (!req.session.autenticado) {
        return res.status(401).json({ erro: 'informe um access_token válido para continuar' });
    }
    next();
}

module.exports = exigeLogin;
