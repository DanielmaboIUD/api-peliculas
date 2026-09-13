import { useState } from 'react';
import Cargando from '../componentes/Cargando';
import CampoTexto from '../componentes/CampoTexto';
import MensajeError from '../componentes/MensajeError';
import Modal from '../componentes/Modal';
import SinDatos from '../componentes/SinDatos';
import Tabla from '../componentes/Tabla';
import { useRecurso } from '../api/useRecurso';

const vacios = (campos) => Object.fromEntries(campos.map(({ nombre }) => [nombre, '']));

const desdeFila = (campos, fila, conEstado) => ({
  ...Object.fromEntries(campos.map(({ nombre }) => [nombre, fila[nombre] ?? ''])),
  ...(conEstado ? { estado: fila.estado } : {}),
});

// Pantalla comun a Genero, Director, Productora y Tipo. Cada modulo la
// configura con sus campos y sus funciones de la capa de API.
function Catalogo({ titulo, descripcion, singular, campos, conEstado = false, recursos }) {
  const { datos, meta, cargando, error, recargar } = useRecurso(
    () => recursos.listar({ limite: 100 }),
    []
  );

  const [formulario, setFormulario] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [porEliminar, setPorEliminar] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  const abrirCreacion = () => {
    setErrorFormulario(null);
    setFormulario({
      editando: null,
      valores: { ...vacios(campos), ...(conEstado ? { estado: 'Activo' } : {}) },
    });
  };

  const abrirEdicion = (fila) => {
    setErrorFormulario(null);
    setFormulario({ editando: fila, valores: desdeFila(campos, fila, conEstado) });
  };

  const escribir = (nombre, valor) =>
    setFormulario((previo) => ({ ...previo, valores: { ...previo.valores, [nombre]: valor } }));

  const guardar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setErrorFormulario(null);
    try {
      const { editando, valores } = formulario;
      if (editando) await recursos.actualizar(editando._id, valores);
      else await recursos.crear(valores);
      setFormulario(null);
      recargar();
    } catch (fallo) {
      setErrorFormulario(fallo);
    } finally {
      setGuardando(false);
    }
  };

  const alternarEstado = async (fila) => {
    setOcupado(true);
    try {
      await recursos.cambiarEstado(fila._id);
      recargar();
    } catch (fallo) {
      setErrorEliminar(fallo);
      setPorEliminar(fila);
    } finally {
      setOcupado(false);
    }
  };

  const eliminar = async () => {
    setOcupado(true);
    setErrorEliminar(null);
    try {
      await recursos.eliminar(porEliminar._id);
      setPorEliminar(null);
      recargar();
    } catch (fallo) {
      setErrorEliminar(fallo);
    } finally {
      setOcupado(false);
    }
  };

  // Alternativa que ofrece la API cuando el registro esta en uso.
  const desactivarEnVezDeBorrar = async () => {
    setOcupado(true);
    try {
      await recursos.cambiarEstado(porEliminar._id);
      setPorEliminar(null);
      setErrorEliminar(null);
      recargar();
    } catch (fallo) {
      setErrorEliminar(fallo);
    } finally {
      setOcupado(false);
    }
  };

  const columnas = [
    ...campos.map(({ nombre, etiqueta, multilinea }) => ({
      clave: nombre,
      titulo: etiqueta,
      larga: multilinea,
    })),
    ...(conEstado
      ? [
          {
            clave: 'estado',
            titulo: 'Estado',
            render: (fila) => (
              <span className={`etiqueta-estado ${fila.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
                {fila.estado}
              </span>
            ),
          },
        ]
      : []),
  ];

  // El 400 marca cada input; un 409 por nombre repetido no trae detalles y va
  // sobre el formulario.
  const errorDeCampo = (nombre) => errorFormulario?.mensajeDe?.(nombre);
  const hayErroresDeCampo = campos.some(({ nombre }) => errorDeCampo(nombre));

  const enUso = errorEliminar?.codigo === 409;
  const sePuedeDesactivar = enUso && conEstado && porEliminar?.estado === 'Activo';

  return (
    <>
      <header>
        <h1>{titulo}</h1>
        <p>{descripcion}</p>
      </header>

      <div className="barra-acciones">
        <button type="button" className="primario" onClick={abrirCreacion}>
          Nuevo {singular}
        </button>
        {meta && <span className="conteo">{meta.total} registrados</span>}
      </div>

      {cargando && <Cargando />}
      {error && <MensajeError error={error} onReintentar={recargar} />}

      {datos?.length === 0 && (
        <SinDatos mensaje={`Todavia no hay ningun ${singular}.`}>
          <button type="button" onClick={abrirCreacion}>
            Crear el primero
          </button>
        </SinDatos>
      )}

      {datos?.length > 0 && (
        <Tabla
          columnas={columnas}
          filas={datos}
          acciones={(fila) => (
            <>
              <button type="button" onClick={() => abrirEdicion(fila)}>
                Editar
              </button>
              {conEstado && (
                <button type="button" disabled={ocupado} onClick={() => alternarEstado(fila)}>
                  {fila.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                </button>
              )}
              <button
                type="button"
                className="peligro"
                onClick={() => {
                  setErrorEliminar(null);
                  setPorEliminar(fila);
                }}
              >
                Eliminar
              </button>
            </>
          )}
        />
      )}

      {formulario && (
        <Modal
          titulo={`${formulario.editando ? 'Editar' : 'Nuevo'} ${singular}`}
          onCerrar={() => setFormulario(null)}
        >
          <form onSubmit={guardar}>
            {errorFormulario && !hayErroresDeCampo && (
              <p className="aviso-formulario">{errorFormulario.message}</p>
            )}

            {campos.map(({ nombre, etiqueta, requerido, multilinea, maxLength }) => (
              <CampoTexto
                key={nombre}
                id={nombre}
                etiqueta={etiqueta}
                valor={formulario.valores[nombre]}
                onChange={(valor) => escribir(nombre, valor)}
                error={errorDeCampo(nombre)}
                requerido={requerido}
                multilinea={multilinea}
                maxLength={maxLength}
              />
            ))}

            {conEstado && (
              <div className="campo">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  value={formulario.valores.estado}
                  onChange={(evento) => escribir('estado', evento.target.value)}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
                {errorDeCampo('estado') && <p className="error-campo">{errorDeCampo('estado')}</p>}
              </div>
            )}

            <div className="pie-modal">
              <button type="button" onClick={() => setFormulario(null)}>
                Cancelar
              </button>
              <button type="submit" className="primario" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {porEliminar && (
        <Modal titulo={`Eliminar ${singular}`} onCerrar={() => setPorEliminar(null)}>
          {!errorEliminar && (
            <p>
              Se va a eliminar <strong>{porEliminar[campos[0].nombre]}</strong>. Esta accion no se
              puede deshacer.
            </p>
          )}

          {errorEliminar && (
            <div className="aviso-formulario">
              <p>{errorEliminar.message}</p>
              {/* El detalle de la API explica como proceder. Si se ofrece el
                  boton, sobra: repetiria la instruccion en jerga de REST. */}
              {!sePuedeDesactivar &&
                errorEliminar.detalles?.map((detalle) => (
                  <p key={detalle.campo}>{detalle.mensaje}</p>
                ))}
            </div>
          )}

          <div className="pie-modal">
            <button type="button" onClick={() => setPorEliminar(null)}>
              {errorEliminar ? 'Cerrar' : 'Cancelar'}
            </button>

            {sePuedeDesactivar && (
              <button type="button" disabled={ocupado} onClick={desactivarEnVezDeBorrar}>
                Desactivar en su lugar
              </button>
            )}

            {!errorEliminar && (
              <button type="button" className="primario peligro" disabled={ocupado} onClick={eliminar}>
                {ocupado ? 'Eliminando...' : 'Eliminar'}
              </button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

export default Catalogo;
