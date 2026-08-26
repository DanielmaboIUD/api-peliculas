function ok(res, { statusCode = 200, mensaje = 'Operacion exitosa', datos = null, meta = undefined }) {
  const cuerpo = { exito: true, mensaje };
  if (meta) cuerpo.meta = meta;
  if (datos !== null) cuerpo.datos = datos;
  return res.status(statusCode).json(cuerpo);
}

module.exports = { ok };
