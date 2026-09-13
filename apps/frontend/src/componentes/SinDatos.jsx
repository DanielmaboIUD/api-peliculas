function SinDatos({ mensaje = 'Todavia no hay registros.', children }) {
  return (
    <div className="estado">
      <p>{mensaje}</p>
      {children}
    </div>
  );
}

export default SinDatos;
