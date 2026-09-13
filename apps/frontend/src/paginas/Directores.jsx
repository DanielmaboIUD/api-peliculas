import Catalogo from './Catalogo';
import {
  actualizarDirector,
  cambiarEstadoDirector,
  crearDirector,
  eliminarDirector,
  listarDirectores,
} from '../api/recursos';

// El campo se llama nombres, en plural, porque asi lo nombra la API.
const CAMPOS = [{ nombre: 'nombres', etiqueta: 'Nombres', requerido: true, maxLength: 150 }];

function Directores() {
  return (
    <Catalogo
      titulo="Directores"
      descripcion="Responsables de la direccion de cada produccion."
      singular="director"
      campos={CAMPOS}
      conEstado
      recursos={{
        listar: listarDirectores,
        crear: crearDirector,
        actualizar: actualizarDirector,
        cambiarEstado: cambiarEstadoDirector,
        eliminar: eliminarDirector,
      }}
    />
  );
}

export default Directores;
