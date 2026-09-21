require('dotenv').config();
const app = require('./app');
const { asegurarConexion } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await asegurarConexion();
    app.listen(PORT, () => {
      console.log(`[API] Servidor escuchando en http://localhost:${PORT}`);
      console.log(`[API] Documentacion de endpoints en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('[API] No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
}

iniciar();
