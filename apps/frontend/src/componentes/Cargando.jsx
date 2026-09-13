function Cargando({ mensaje = 'Cargando...' }) {
  return (
    <p className="estado" role="status">
      {mensaje}
    </p>
  );
}

export default Cargando;
