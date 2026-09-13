// columnas: [{ clave, titulo, larga, render }]. acciones recibe la fila y
// devuelve los botones de esa fila.
function Tabla({ columnas, filas, acciones }) {
  return (
    <div className="tabla-scroll tarjeta">
      <table>
        <thead>
          <tr>
            {columnas.map(({ clave, titulo }) => (
              <th key={clave}>{titulo}</th>
            ))}
            {acciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila._id}>
              {columnas.map(({ clave, larga, render }) => (
                <td key={clave} className={larga ? 'celda-larga' : undefined}>
                  {render ? render(fila) : fila[clave]}
                </td>
              ))}
              {acciones && (
                <td>
                  <div className="acciones-fila">{acciones(fila)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tabla;
