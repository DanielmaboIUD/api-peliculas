import { ErrorApi } from './api/cliente';

// Refleja las reglas del backend para avisar antes de enviar. Es comodidad: la
// validacion que manda sigue siendo la del servidor, y sus errores se siguen
// mostrando igual.

export const ANIO_MINIMO = 1888;
export const ANIO_MAXIMO = new Date().getFullYear() + 5;

// Como isURL de express-validator: el protocolo es opcional, pero el dominio
// necesita un punto y no se admiten espacios.
function esUrl(valor) {
  if (/\s/.test(valor)) return false;
  try {
    const url = new URL(/^[a-z]+:\/\//i.test(valor) ? valor : `http://${valor}`);
    return ['http:', 'https:', 'ftp:'].includes(url.protocol) && url.hostname.includes('.');
  } catch {
    return false;
  }
}

export const obligatorio = (mensaje) => (valor) => (valor === '' ? mensaje : null);

export const url = (mensaje) => (valor) => (valor !== '' && !esUrl(valor) ? mensaje : null);

export const anio = (valor) => {
  if (valor === '') return null;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= ANIO_MINIMO && numero <= ANIO_MAXIMO
    ? null
    : `El año debe estar entre ${ANIO_MINIMO} y ${ANIO_MAXIMO}`;
};

// reglas: { campo: [comprobacion, ...] }. Cada comprobacion devuelve el mensaje
// de error o null; se muestra la primera que falle. El resultado tiene la misma
// forma que un 400 de la API, asi los formularios lo pintan sin cambios.
export function validar(valores, reglas) {
  const detalles = [];
  for (const [campo, comprobaciones] of Object.entries(reglas)) {
    const valor = String(valores[campo] ?? '').trim();
    const mensaje = comprobaciones.map((comprobar) => comprobar(valor)).find(Boolean);
    if (mensaje) detalles.push({ campo, mensaje });
  }
  return detalles.length ? new ErrorApi('El formulario tiene errores', 0, detalles) : null;
}
