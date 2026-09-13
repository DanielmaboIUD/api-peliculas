import { Link } from 'react-router-dom';

function NoEncontrada() {
  return (
    <header>
      <h1>Pagina no encontrada</h1>
      <p>
        Esa direccion no corresponde a ningun modulo. <Link to="/">Volver al resumen</Link>.
      </p>
    </header>
  );
}

export default NoEncontrada;
