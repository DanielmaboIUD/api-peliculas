/**
 * Script de datos iniciales.
 * Carga los generos y tipos base del caso de estudio, ademas de algunos
 * directores, productoras y producciones de ejemplo.
 *
 * Uso:  npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { conectarDB, sincronizarIndices } = require('../config/db');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const Media = require('../models/Media');

async function sembrar() {
  await conectarDB();
  await sincronizarIndices();

  console.log('[SEED] Limpiando colecciones...');
  await Promise.all([
    Genero.deleteMany({}),
    Director.deleteMany({}),
    Productora.deleteMany({}),
    Tipo.deleteMany({}),
    Media.deleteMany({}),
  ]);

  console.log('[SEED] Insertando generos...');
  const generos = await Genero.insertMany([
    { nombre: 'Accion', descripcion: 'Persecuciones, peleas y ritmo rapido.' },
    { nombre: 'Aventura', descripcion: 'Viajes y exploracion de nuevos mundos.' },
    { nombre: 'Ciencia ficcion', descripcion: 'Tecnologia, espacio y futuros posibles.' },
    { nombre: 'Drama', descripcion: 'Conflictos humanos y emocionales.' },
    { nombre: 'Terror', descripcion: 'Suspenso y miedo.' },
  ]);

  console.log('[SEED] Insertando tipos...');
  const tipos = await Tipo.insertMany([
    { nombre: 'Pelicula', descripcion: 'Produccion de una sola pieza audiovisual.' },
    { nombre: 'Serie', descripcion: 'Produccion dividida en temporadas y capitulos.' },
  ]);

  console.log('[SEED] Insertando directores...');
  const directores = await Director.insertMany([
    { nombres: 'Christopher Nolan' },
    { nombres: 'Denis Villeneuve' },
    { nombres: 'Greta Gerwig' },
  ]);

  console.log('[SEED] Insertando productoras...');
  const productoras = await Productora.insertMany([
    { nombre: 'Warner Bros', slogan: 'The reel thing', descripcion: 'Estudio estadounidense fundado en 1923.' },
    { nombre: 'Legendary Pictures', slogan: 'Stories worth telling', descripcion: 'Productora de cine y television.' },
  ]);

  console.log('[SEED] Insertando producciones...');
  await Media.insertMany([
    {
      serial: 'MOV-0001',
      titulo: 'Interstellar',
      sinopsis: 'Un grupo de exploradores viaja mas alla de nuestra galaxia buscando un nuevo hogar.',
      url: 'https://peliculas.iudigital.edu.co/interstellar',
      imagenPortada: 'https://peliculas.iudigital.edu.co/portadas/interstellar.jpg',
      anioEstreno: 2014,
      genero: generos[2]._id,
      director: directores[0]._id,
      productora: productoras[0]._id,
      tipo: tipos[0]._id,
    },
    {
      serial: 'MOV-0002',
      titulo: 'Dune',
      sinopsis: 'Paul Atreides debe viajar al planeta mas peligroso del universo para asegurar el futuro de su familia.',
      url: 'https://peliculas.iudigital.edu.co/dune',
      imagenPortada: 'https://peliculas.iudigital.edu.co/portadas/dune.jpg',
      anioEstreno: 2021,
      genero: generos[1]._id,
      director: directores[1]._id,
      productora: productoras[1]._id,
      tipo: tipos[0]._id,
    },
  ]);

  console.log('[SEED] Datos iniciales cargados correctamente.');
  await mongoose.disconnect();
  process.exit(0);
}

sembrar().catch(async (error) => {
  console.error('[SEED] Error cargando los datos:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
