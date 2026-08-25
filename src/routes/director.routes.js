const { Router } = require('express');
const controlador = require('../controllers/director.controller');
const validarCampos = require('../middlewares/validarCampos');
const { validarIdMongo } = require('../validators/comunes');
const { crearDirector, actualizarDirector } = require('../validators/director.validator');

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', validarIdMongo, validarCampos, controlador.obtener);
router.post('/', crearDirector, validarCampos, controlador.crear);
router.put('/:id', validarIdMongo, actualizarDirector, validarCampos, controlador.actualizar);
router.patch('/:id/estado', validarIdMongo, validarCampos, controlador.cambiarEstado);
router.delete('/:id', validarIdMongo, validarCampos, controlador.eliminar);

module.exports = router;
