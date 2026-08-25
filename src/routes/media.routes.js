const { Router } = require('express');
const controlador = require('../controllers/media.controller');
const validarCampos = require('../middlewares/validarCampos');
const { validarIdMongo } = require('../validators/comunes');
const { crearMedia, actualizarMedia } = require('../validators/media.validator');

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', validarIdMongo, validarCampos, controlador.obtener);
router.post('/', crearMedia, validarCampos, controlador.crear);
router.put('/:id', validarIdMongo, actualizarMedia, validarCampos, controlador.actualizar);
router.delete('/:id', validarIdMongo, validarCampos, controlador.eliminar);

module.exports = router;
