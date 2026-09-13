import { listarGeneros } from './api/recursos';
import { useRecurso } from './api/useRecurso';

// Prueba de la capa de acceso. La etapa 3 la sustituye por el layout y las rutas.
function App() {
  const { datos, meta, cargando, error, recargar } = useRecurso(() => listarGeneros(), []);

  return (
    <main>
      <h1>Peliculas y series</h1>
      <p>Panel de administracion. Ingenieria Web II, IU Digital de Antioquia.</p>

      <h2>Generos</h2>
      <button type="button" onClick={recargar} disabled={cargando}>
        Recargar
      </button>

      {cargando && <p>Cargando...</p>}

      {error && (
        <p>
          {error.codigo ? `Error ${error.codigo}: ` : ''}
          {error.message}
        </p>
      )}

      {datos?.length === 0 && <p>No hay generos registrados.</p>}

      {datos?.length > 0 && (
        <>
          <ul>
            {datos.map((genero) => (
              <li key={genero._id}>
                {genero.nombre} ({genero.estado})
              </li>
            ))}
          </ul>
          <p>
            {meta.total} en total, pagina {meta.pagina} de {meta.paginas}
          </p>
        </>
      )}
    </main>
  );
}

export default App;
