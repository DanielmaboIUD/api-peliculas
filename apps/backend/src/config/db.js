const mongoose = require('mongoose');

// Si Mongo no responde en este tiempo, la conexion falla en lugar de dejar la
// peticion esperando. El valor por defecto del driver es 30 s.
const ESPERA_MAXIMA_MS = 5000;

async function conectarDB(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('No se definio la variable de entorno MONGO_URI');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: ESPERA_MAXIMA_MS });
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

// En Vercel no corre server.js: la primera peticion abre la conexion y las
// siguientes de la misma instancia reutilizan esta promesa. Si falla, se
// descarta para que la proxima peticion lo intente de nuevo.
let conexion = null;

function asegurarConexion() {
  if (!conexion) {
    conexion = conectarDB()
      .then(() => sincronizarIndices())
      .then((modelos) => console.log(`[DB] Indices listos: ${modelos.join(', ')}`))
      .catch((error) => {
        conexion = null;
        throw error;
      });
  }
  return conexion;
}

module.exports = { conectarDB, sincronizarIndices, asegurarConexion };
