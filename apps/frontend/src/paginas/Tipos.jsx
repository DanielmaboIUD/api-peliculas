import Catalogo from './Catalogo';
import { actualizarTipo, crearTipo, eliminarTipo, listarTipos } from '../api/recursos';

const CAMPOS = [
  { nombre: 'nombre', etiqueta: 'Nombre', requerido: 'El nombre del tipo es obligatorio', maxLength: 100 },
  { nombre: 'descripcion', etiqueta: 'Descripcion', multilinea: true, maxLength: 500 },
];

// Sin estado: el caso de estudio no lo pide y la API no expone
// PATCH /tipos/:id/estado.
function Tipos() {
  return (
    <Catalogo
      titulo="Tipos"
      descripcion="Pelicula, serie y demas formatos de produccion."
      singular="tipo"
      campos={CAMPOS}
      recursos={{
        listar: listarTipos,
        crear: crearTipo,
        actualizar: actualizarTipo,
        eliminar: eliminarTipo,
      }}
    />
  );
}

export default Tipos;
