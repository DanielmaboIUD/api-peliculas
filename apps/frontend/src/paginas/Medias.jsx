import { useEffect, useState } from 'react';
import Cargando from '../componentes/Cargando';
import MensajeError from '../componentes/MensajeError';
import Modal from '../componentes/Modal';
import SinDatos from '../componentes/SinDatos';
import FormularioMedia from './FormularioMedia';
import { eliminarMedia, listarGeneros, listarMedias, listarTipos } from '../api/recursos';
import { useRecurso } from '../api/useRecurso';
import '../estilos/medias.css';

const POR_PAGINA = 8;
const FILTROS_VACIOS = { buscar: '', genero: '', tipo: '', anioEstreno: '' };

// Los filtros incluyen generos inactivos: una produccion antigua puede seguir
// usando uno, y tiene que poder encontrarse.
async function cargarFiltros() {
  const [generos, tipos] = await Promise.all([
    listarGeneros({ limite: 100 }),
    listarTipos({ limite: 100 }),
  ]);
  return { datos: { generos: generos.datos, tipos: tipos.datos }, meta: null };
}

function Portada({ src, titulo }) {
  const [fallo, setFallo] = useState(false);

  if (!src || fallo) {
    return (
      <div className="portada portada-vacia" aria-hidden="true">
        <span>{titulo.slice(0, 1)}</span>
        <small>Sin portada</small>
      </div>
    );
  }

  return (
    <img
      className="portada"
      src={src}
      alt={`Portada de ${titulo}`}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  );
}

function Medias() {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [aplicados, setAplicados] = useState(FILTROS_VACIOS);
  const [pagina, setPagina] = useState(1);

  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  // Espera a que se deje de escribir antes de consultar, y vuelve a la primera
  // pagina: la actual puede no existir con el filtro nuevo.
  useEffect(() => {
    const espera = setTimeout(() => {
      setAplicados(filtros);
      setPagina(1);
    }, 350);
    return () => clearTimeout(espera);
  }, [filtros]);

  const opcionesFiltro = useRecurso(cargarFiltros, []);
  const { datos, meta, cargando, error, recargar } = useRecurso(
    () => listarMedias({ ...aplicados, pagina, limite: POR_PAGINA }),
    [aplicados, pagina]
  );

  // Tras borrar el ultimo elemento de la ultima pagina, esa pagina deja de existir.
  useEffect(() => {
    if (meta && pagina > meta.paginas) setPagina(meta.paginas);
  }, [meta, pagina]);

  const cambiarFiltro = (nombre, valor) => setFiltros((previo) => ({ ...previo, [nombre]: valor }));
  const hayFiltros = Object.values(filtros).some((valor) => valor !== '');

  const alGuardar = () => {
    setFormulario(null);
    recargar();
  };

  const eliminar = async () => {
    setEliminando(true);
    setErrorEliminar(null);
    try {
      await eliminarMedia(porEliminar._id);
      setPorEliminar(null);
      recargar();
    } catch (fallo) {
      setErrorEliminar(fallo);
      if (fallo.codigo === 404) recargar();
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <header>
        <h1>Producciones</h1>
        <p>Peliculas y series del catalogo.</p>
      </header>

      <div className="barra-acciones">
        <button type="button" className="primario" onClick={() => setFormulario({ media: null })}>
          Nueva produccion
        </button>
        {meta && (
          <span className="conteo">
            {meta.total} {meta.total === 1 ? 'produccion' : 'producciones'}
          </span>
        )}
      </div>

      <form className="filtros tarjeta" role="search" onSubmit={(evento) => evento.preventDefault()}>
        <div className="campo">
          <label htmlFor="filtro-buscar">Buscar</label>
          <input
            id="filtro-buscar"
            type="search"
            placeholder="Titulo, sinopsis o serial"
            value={filtros.buscar}
            onChange={(evento) => cambiarFiltro('buscar', evento.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="filtro-genero">Genero</label>
          <select
            id="filtro-genero"
            value={filtros.genero}
            onChange={(evento) => cambiarFiltro('genero', evento.target.value)}
          >
            <option value="">Todos</option>
            {opcionesFiltro.datos?.generos.map((genero) => (
              <option key={genero._id} value={genero._id}>
                {genero.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="filtro-tipo">Tipo</label>
          <select
            id="filtro-tipo"
            value={filtros.tipo}
            onChange={(evento) => cambiarFiltro('tipo', evento.target.value)}
          >
            <option value="">Todos</option>
            {opcionesFiltro.datos?.tipos.map((tipo) => (
              <option key={tipo._id} value={tipo._id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="filtro-anio">Año</label>
          <input
            id="filtro-anio"
            type="number"
            placeholder="Cualquiera"
            value={filtros.anioEstreno}
            onChange={(evento) => cambiarFiltro('anioEstreno', evento.target.value)}
          />
        </div>

        {hayFiltros && (
          <button type="button" className="limpiar-filtros" onClick={() => setFiltros(FILTROS_VACIOS)}>
            Limpiar filtros
          </button>
        )}
      </form>

      {cargando && <Cargando />}
      {error && <MensajeError error={error} onReintentar={recargar} />}

      {datos?.length === 0 && (
        <SinDatos
          mensaje={
            hayFiltros
              ? 'Ninguna produccion coincide con los filtros.'
              : 'Todavia no hay producciones registradas.'
          }
        />
      )}

      {datos?.length > 0 && (
        <ul className="rejilla-medias">
          {datos.map((media) => (
            <li key={media._id} className="tarjeta tarjeta-media">
              <Portada key={media.imagenPortada} src={media.imagenPortada} titulo={media.titulo} />
              <div className="cuerpo-media">
                <h2>{media.titulo}</h2>
                <p className="datos-media">
                  {media.anioEstreno} · {media.genero?.nombre ?? 'Sin genero'}
                  {media.tipo && ` · ${media.tipo.nombre}`}
                </p>
                <div className="acciones-fila">
                  <button
                    type="button"
                    aria-label={`Editar ${media.titulo}`}
                    onClick={() => setFormulario({ media })}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="peligro"
                    aria-label={`Eliminar ${media.titulo}`}
                    onClick={() => {
                      setErrorEliminar(null);
                      setPorEliminar(media);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.paginas > 1 && (
        <nav className="paginacion" aria-label="Paginacion">
          <button type="button" disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>
            Anterior
          </button>
          <span>
            Pagina {meta.pagina} de {meta.paginas}
          </span>
          <button
            type="button"
            disabled={pagina >= meta.paginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente
          </button>
        </nav>
      )}

      {formulario && (
        <Modal
          amplio
          titulo={formulario.media ? 'Editar produccion' : 'Nueva produccion'}
          onCerrar={() => setFormulario(null)}
        >
          <FormularioMedia
            media={formulario.media}
            onGuardado={alGuardar}
            onCancelar={() => setFormulario(null)}
            onNoEncontrada={recargar}
          />
        </Modal>
      )}

      {porEliminar && (
        <Modal titulo="Eliminar produccion" onCerrar={() => setPorEliminar(null)}>
          {errorEliminar ? (
            <p className="aviso-formulario" role="alert">
              {errorEliminar.message}
            </p>
          ) : (
            <p>
              Se va a eliminar <strong>{porEliminar.titulo}</strong>. Esta accion no se puede deshacer.
            </p>
          )}
          <div className="pie-modal">
            <button type="button" onClick={() => setPorEliminar(null)}>
              {errorEliminar ? 'Cerrar' : 'Cancelar'}
            </button>
            {!errorEliminar && (
              <button type="button" className="primario peligro" disabled={eliminando} onClick={eliminar}>
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default Medias;
