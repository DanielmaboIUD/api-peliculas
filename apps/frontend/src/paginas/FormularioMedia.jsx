import { useState } from 'react';
import CampoTexto from '../componentes/CampoTexto';
import Cargando from '../componentes/Cargando';
import MensajeError from '../componentes/MensajeError';
import {
  actualizarMedia,
  crearMedia,
  listarDirectores,
  listarGeneros,
  listarProductoras,
  listarTipos,
} from '../api/recursos';
import { useRecurso } from '../api/useRecurso';

const ANIO_MAXIMO = new Date().getFullYear() + 5;

const RELACIONES = [
  { nombre: 'genero', etiqueta: 'Genero', texto: (opcion) => opcion.nombre },
  { nombre: 'director', etiqueta: 'Director', texto: (opcion) => opcion.nombres },
  { nombre: 'productora', etiqueta: 'Productora', texto: (opcion) => opcion.nombre },
  { nombre: 'tipo', etiqueta: 'Tipo', texto: (opcion) => opcion.nombre },
];

// Genero, director y productora se piden solo activos: es la forma de aplicar
// en el cliente la regla del caso de estudio. Tipo no tiene estado.
async function cargarOpciones() {
  const [genero, director, productora, tipo] = await Promise.all([
    listarGeneros({ estado: 'Activo', limite: 100 }),
    listarDirectores({ estado: 'Activo', limite: 100 }),
    listarProductoras({ estado: 'Activo', limite: 100 }),
    listarTipos({ limite: 100 }),
  ]);
  return {
    datos: {
      genero: genero.datos,
      director: director.datos,
      productora: productora.datos,
      tipo: tipo.datos,
    },
    meta: null,
  };
}

function valoresIniciales(media) {
  return {
    serial: media?.serial ?? '',
    titulo: media?.titulo ?? '',
    sinopsis: media?.sinopsis ?? '',
    url: media?.url ?? '',
    imagenPortada: media?.imagenPortada ?? '',
    anioEstreno: media?.anioEstreno ? String(media.anioEstreno) : '',
    genero: media?.genero?._id ?? '',
    director: media?.director?._id ?? '',
    productora: media?.productora?._id ?? '',
    tipo: media?.tipo?._id ?? '',
  };
}

function FormularioMedia({ media, onGuardado, onCancelar }) {
  const opciones = useRecurso(cargarOpciones, []);
  const [valores, setValores] = useState(() => valoresIniciales(media));
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const escribir = (nombre, valor) => setValores((previo) => ({ ...previo, [nombre]: valor }));

  // Al editar, la referencia guardada puede estar ya inactiva y no venir en la
  // lista. Se muestra deshabilitada para que se vea por que la API la rechaza.
  const opcionesDe = ({ nombre }) => {
    const lista = opciones.datos[nombre];
    const guardada = media?.[nombre];
    if (guardada && !lista.some((opcion) => opcion._id === guardada._id)) {
      return [{ ...guardada, noDisponible: true }, ...lista];
    }
    return lista;
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setError(null);
    const cuerpo = {
      ...valores,
      anioEstreno: valores.anioEstreno === '' ? '' : Number(valores.anioEstreno),
    };
    try {
      if (media) await actualizarMedia(media._id, cuerpo);
      else await crearMedia(cuerpo);
      onGuardado();
    } catch (fallo) {
      setError(fallo);
      setGuardando(false);
    }
  };

  if (opciones.cargando) return <Cargando mensaje="Cargando opciones..." />;
  if (opciones.error) return <MensajeError error={opciones.error} onReintentar={opciones.recargar} />;

  const errorDe = (nombre) => error?.mensajeDe?.(nombre);
  const campoConError = Object.keys(valores).some((nombre) => errorDe(nombre));

  const texto = (nombre, etiqueta, extra = {}) => (
    <CampoTexto
      id={nombre}
      etiqueta={etiqueta}
      valor={valores[nombre]}
      onChange={(valor) => escribir(nombre, valor)}
      error={errorDe(nombre)}
      requerido
      {...extra}
    />
  );

  // noValidate: igual que en los catalogos, la validacion que manda es la del
  // servidor y el navegador no debe bloquear el envio antes de que responda.
  return (
    <form onSubmit={guardar} noValidate>
      {/* Con diez campos, alguno marcado puede quedar fuera de la vista. */}
      {error && (
        <p className="aviso-formulario">
          {error.message}
          {campoConError && '. Revise los campos marcados.'}
        </p>
      )}

      <div className="rejilla-formulario">
        {texto('serial', 'Serial', { maxLength: 50 })}
        {texto('anioEstreno', 'Año de estreno', { tipo: 'number' })}
        {texto('titulo', 'Titulo', { maxLength: 200, className: 'ancho-completo' })}
        {texto('sinopsis', 'Sinopsis', { multilinea: true, maxLength: 2000, className: 'ancho-completo' })}
        {texto('url', 'URL de la produccion', { tipo: 'url', className: 'ancho-completo' })}
        {texto('imagenPortada', 'URL de la portada', { tipo: 'url', className: 'ancho-completo' })}

        {RELACIONES.map((relacion) => (
          <div className="campo" key={relacion.nombre}>
            <label htmlFor={relacion.nombre}>
              {relacion.etiqueta}
              <span className="marca-requerido"> *</span>
            </label>
            <select
              id={relacion.nombre}
              value={valores[relacion.nombre]}
              onChange={(evento) => escribir(relacion.nombre, evento.target.value)}
              aria-invalid={errorDe(relacion.nombre) ? 'true' : undefined}
              aria-describedby={errorDe(relacion.nombre) ? `${relacion.nombre}-error` : undefined}
            >
              <option value="">Seleccione...</option>
              {opcionesDe(relacion).map((opcion) => (
                <option key={opcion._id} value={opcion._id} disabled={opcion.noDisponible}>
                  {relacion.texto(opcion)}
                  {opcion.noDisponible ? ' (inactivo)' : ''}
                </option>
              ))}
            </select>
            {errorDe(relacion.nombre) && (
              <p className="error-campo" id={`${relacion.nombre}-error`}>
                {errorDe(relacion.nombre)}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="nota-formulario">
        Solo se ofrecen generos, directores y productoras activos. El año va de 1888 a {ANIO_MAXIMO}.
      </p>

      <div className="pie-modal">
        <button type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="primario" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

export default FormularioMedia;
