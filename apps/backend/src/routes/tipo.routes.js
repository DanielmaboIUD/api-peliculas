const { Router } = require('express');
const controlador = require('../controllers/tipo.controller');
const validarCampos = require('../middlewares/validarCampos');
const { validarIdMongo } = require('../validators/comunes');
const { crearTipo, actualizarTipo } = require('../validators/tipo.validator');

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', validarIdMongo, validarCampos, controlador.obtener);
router.post('/', crearTipo, validarCampos, controlador.crear);
router.put('/:id', validarIdMongo, actualizarTipo, validarCampos, controlador.actualizar);
router.delete('/:id', validarIdMongo, validarCampos, controlador.eliminar);

module.exports = router;
