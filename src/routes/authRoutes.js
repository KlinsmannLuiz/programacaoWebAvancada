const express = require('express');
const controller = require('../controllers/AuthController')
const existeLogin = require('../middlewares/existeLogin')

const router = express.Router();

router.post('/login', controller.login);
router.get('/perfil', existeLogin, controller.perfil);
router.post('/logout', existeLogin, controller.logout);

module.exports = router