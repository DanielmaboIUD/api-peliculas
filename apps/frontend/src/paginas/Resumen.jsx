import { Link } from 'react-router-dom';
import Cargando from '../componentes/Cargando';
import MensajeError from '../componentes/MensajeError';
import {
  listarDirectores,
  listarGeneros,
  listarMedias,
  listarProductoras,
  listarTipos,
} from '../api/recursos';
import { useRecurso } from '../api/useRecurso';

const MODULOS = [
  { nombre: 'Generos', ruta: '/generos', listar: listarGeneros },
  { nombre: 'Directores', ruta: '/directores', listar: listarDirectores },
  { nombre: 'Productoras', ruta: '/productoras', listar: listarProductoras },
  { nombre: 'Tipos', ruta: '/tipos', listar: listarTipos },
  { nombre: 'Producciones', ruta: '/medias', listar: listarMedias },
];

// Pide una sola fila de cada modulo: lo que interesa es meta.total.
async function contarModulos() {
  const respuestas = await Promise.all(MODULOS.map(({ listar }) => listar({ limite: 1 })));
  return {
    datos: MODULOS.map((modulo, indice) => ({
      ...modulo,
      total: respuestas[indice].meta.total,
    })),
    meta: null,
  };
}

function Resumen() {
  const { datos, cargando, error, recargar } = useRecurso(contarModulos, []);

  return (
    <>
      <header>
        <h1>Resumen</h1>
        <p>Registros cargados en cada modulo.</p>
      </header>

      {cargando && <Cargando />}
      {error && <MensajeError error={error} onReintentar={recargar} />}

      {datos && (
        <div className="rejilla">
          {datos.map(({ nombre, ruta, total }) => (
            <Link key={ruta} to={ruta} className="tarjeta">
              <span className="cifra">{total}</span>
              <span className="nombre">{nombre}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default Resumen;
