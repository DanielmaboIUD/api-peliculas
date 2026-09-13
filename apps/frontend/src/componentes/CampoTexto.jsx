// Sin el atributo required: el navegador bloquearia el envio con su propio
// globo. La validacion de cliente esta en validacion.js y pinta sus errores en
// el mismo sitio que los del servidor.
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
        {requerido && (
          <span className="marca-requerido" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      <Control
        id={id}
        name={id}
        type={multilinea ? undefined : tipo}
        value={valor}
        onChange={(evento) => onChange(evento.target.value)}
        maxLength={maxLength}
        rows={multilinea ? 3 : undefined}
        aria-required={requerido ? 'true' : undefined}
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
