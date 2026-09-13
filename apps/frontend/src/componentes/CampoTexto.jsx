// Sin el atributo required: la validacion que manda es la del servidor, y el
// navegador impediria comprobar que sus mensajes llegan. La etapa 6 anade la
// validacion de cliente encima.
function CampoTexto({
  id,
  etiqueta,
  valor,
  onChange,
  error,
  multilinea,
  requerido,
  maxLength,
  tipo = 'text',
  className,
}) {
  const Control = multilinea ? 'textarea' : 'input';

  return (
    <div className={className ? `campo ${className}` : 'campo'}>
      <label htmlFor={id}>
        {etiqueta}
        {requerido && <span className="marca-requerido"> *</span>}
      </label>
      <Control
        id={id}
        name={id}
        type={multilinea ? undefined : tipo}
        value={valor}
        onChange={(evento) => onChange(evento.target.value)}
        maxLength={maxLength}
        rows={multilinea ? 3 : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p className="error-campo" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default CampoTexto;
