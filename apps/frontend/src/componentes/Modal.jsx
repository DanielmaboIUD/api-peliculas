import { useEffect, useRef } from 'react';

function Modal({ titulo, onCerrar, amplio, children }) {
  const caja = useRef(null);

  // Solo al abrir: si se repitiera en cada render robaria el foco a los inputs.
  useEffect(() => {
    caja.current?.focus();
  }, []);

  useEffect(() => {
    const alPulsar = (evento) => {
      if (evento.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [onCerrar]);

  return (
    <div className="fondo-modal">
      <div
        className={amplio ? 'modal modal-amplio tarjeta' : 'modal tarjeta'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
        tabIndex={-1}
        ref={caja}
      >
        <header className="modal-cabecera">
          <h2 id="titulo-modal">{titulo}</h2>
          <button type="button" className="cerrar" onClick={onCerrar} aria-label="Cerrar">
            &times;
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

export default Modal;
