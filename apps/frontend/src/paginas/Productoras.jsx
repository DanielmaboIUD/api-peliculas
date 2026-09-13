import Catalogo from './Catalogo';
import {
  actualizarProductora,
  cambiarEstadoProductora,
  crearProductora,
  eliminarProductora,
  listarProductoras,
} from '../api/recursos';

const CAMPOS = [
  { nombre: 'nombre', etiqueta: 'Nombre', requerido: true, maxLength: 150 },
  { nombre: 'slogan', etiqueta: 'Slogan', maxLength: 200 },
  { nombre: 'descripcion', etiqueta: 'Descripcion', multilinea: true, maxLength: 500 },
];

function Productoras() {
  return (
    <Catalogo
      titulo="Productoras"
      descripcion="Empresas que producen las peliculas y series."
      singular="productora"
      campos={CAMPOS}
      conEstado
      recursos={{
        listar: listarProductoras,
        crear: crearProductora,
        actualizar: actualizarProductora,
        cambiarEstado: cambiarEstadoProductora,
        eliminar: eliminarProductora,
      }}
    />
  );
}

export default Productoras;
