const mongoose = require('mongoose');

async function conectarDB(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('No se definio la variable MONGO_URI en el archivo .env');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`[DB] Conectado a MongoDB: ${mongoose.connection.name}`);
  return mongoose.connection;
}

// Los indices unique se construyen en segundo plano. Sin esperarlos, las
// primeras peticiones sobre una base nueva alcanzan a insertar duplicados.
async function sincronizarIndices() {
  const modelos = Object.values(mongoose.models);
  await Promise.all(modelos.map((modelo) => modelo.init()));
  return modelos.map((modelo) => modelo.modelName);
}

module.exports = { conectarDB, sincronizarIndices };
