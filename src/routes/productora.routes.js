const { Router } = require('express');
const controlador = require('../controllers/productora.controller');
const validarCampos = require('../middlewares/validarCampos');
const { validarIdMongo } = require('../validators/comunes');
const { crearProductora, actualizarProductora } = require('../validators/productora.validator');

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', validarIdMongo, validarCampos, controlador.obtener);
router.post('/', crearProductora, validarCampos, controlador.crear);
router.put('/:id', validarIdMongo, actualizarProductora, validarCampos, controlador.actualizar);
router.patch('/:id/estado', validarIdMongo, validarCampos, controlador.cambiarEstado);
router.delete('/:id', validarIdMongo, validarCampos, controlador.eliminar);

module.exports = router;
