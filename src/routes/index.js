const { Router } = require('express');

const router = Router();

router.use('/generos', require('./genero.routes'));
router.use('/directores', require('./director.routes'));
router.use('/productoras', require('./productora.routes'));
router.use('/tipos', require('./tipo.routes'));
router.use('/medias', require('./media.routes'));

router.get('/', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'API REST de Peliculas y Series - IU Digital de Antioquia',
    version: '1.0.0',
    modulos: {
      generos: '/api/generos',
      directores: '/api/directores',
      productoras: '/api/productoras',
      tipos: '/api/tipos',
      medias: '/api/medias',
    },
  });
});

module.exports = router;
