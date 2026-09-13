// codigo 0 es un fallo de red, no una respuesta de la API: no se muestra numero.
function MensajeError({ error, onReintentar }) {
  if (!error) return null;

  const detalles = error.detalles ?? [];

  return (
    <div className="estado-error" role="alert">
      <h2>
        {error.codigo ? `Error ${error.codigo}` : 'No hay conexion'}
      </h2>
      <p>{error.message}</p>

      {detalles.length > 0 && (
        <ul>
          {detalles.map((detalle) => (
            <li key={detalle.campo}>
              {detalle.campo}: {detalle.mensaje}
            </li>
          ))}
        </ul>
      )}

      {onReintentar && (
        <button type="button" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export default MensajeError;
