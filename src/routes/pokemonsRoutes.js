const express = require('express')
const controller = require('../controllers/pokemonController')
const existeLogin = require('../middlewares/existeLogin')

const router = express.Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.post('/', existeLogin, controller.criar);
router.put('/:id',existeLogin,controller.atualizar);
router.delete('/:id',existeLogin,controller.excluir);

module.exports = router;