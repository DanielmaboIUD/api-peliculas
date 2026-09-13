import Catalogo from './Catalogo';
import {
  actualizarGenero,
  cambiarEstadoGenero,
  crearGenero,
  eliminarGenero,
  listarGeneros,
} from '../api/recursos';

const CAMPOS = [
  { nombre: 'nombre', etiqueta: 'Nombre', requerido: 'El nombre es obligatorio', maxLength: 100 },
  { nombre: 'descripcion', etiqueta: 'Descripcion', multilinea: true, maxLength: 500 },
];

function Generos() {
  return (
    <Catalogo
      titulo="Generos"
      descripcion="Categorias con las que se clasifican las producciones."
      singular="genero"
      campos={CAMPOS}
      conEstado
      recursos={{
        listar: listarGeneros,
        crear: crearGenero,
        actualizar: actualizarGenero,
        cambiarEstado: cambiarEstadoGenero,
        eliminar: eliminarGenero,
      }}
    />
  );
}

export default Generos;
