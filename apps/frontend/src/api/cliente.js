const BASE = import.meta.env.VITE_API_URL;

// Conserva el codigo HTTP y el arreglo detalles de la API. Sin detalles los
// formularios no pueden marcar el campo que fallo.
export class ErrorApi extends Error {
  constructor(mensaje, codigo = 0, detalles = []) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.codigo = codigo;
    this.detalles = detalles;
  }

  mensajeDe(campo) {
    return this.detalles.find((detalle) => detalle.campo === campo)?.mensaje;
  }
}

function construirUrl(ruta, params) {
  const url = new URL(BASE + ruta, window.location.origin);
  Object.entries(params ?? {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, valor);
    }
  });
  return url;
}

async function pedir(ruta, { metodo = 'GET', cuerpo, params } = {}) {
  const opciones = { method: metodo };
  if (cuerpo !== undefined) {
    opciones.headers = { 'Content-Type': 'application/json' };
    opciones.body = JSON.stringify(cuerpo);
  }

  let respuesta;
  try {
    respuesta = await fetch(construirUrl(ruta, params), opciones);
  } catch {
    throw new ErrorApi('No se pudo conectar con la API. Verifique que este encendida.');
  }

  let contenido;
  try {
    contenido = await respuesta.json();
  } catch {
    throw new ErrorApi(
      `La API respondio ${respuesta.status} sin un cuerpo legible.`,
      respuesta.status
    );
  }

  if (!respuesta.ok || contenido.exito === false) {
    throw new ErrorApi(
      contenido.mensaje ?? 'La API rechazo la peticion.',
      respuesta.status,
      contenido.detalles ?? []
    );
  }

  return { datos: contenido.datos, meta: contenido.meta ?? null };
}

export const cliente = {
  listar: (ruta, params) => pedir(ruta, { params }),
  obtener: (ruta) => pedir(ruta),
  crear: (ruta, cuerpo) => pedir(ruta, { metodo: 'POST', cuerpo }),
  actualizar: (ruta, cuerpo) => pedir(ruta, { metodo: 'PUT', cuerpo }),
  cambiarEstado: (ruta) => pedir(ruta, { metodo: 'PATCH' }),
  eliminar: (ruta) => pedir(ruta, { metodo: 'DELETE' }),
};
