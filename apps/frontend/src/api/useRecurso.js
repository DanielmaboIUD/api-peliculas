import { useCallback, useEffect, useState } from 'react';

// consulta es una funcion sin argumentos que devuelve la promesa del cliente.
// dependencias son los valores que, al cambiar, obligan a repetir la consulta.
export function useRecurso(consulta, dependencias = []) {
  const [estado, setEstado] = useState({
    datos: null,
    meta: null,
    cargando: true,
    error: null,
  });
  const [intento, setIntento] = useState(0);

  const ejecutar = useCallback(consulta, dependencias);
  const recargar = useCallback(() => setIntento((numero) => numero + 1), []);

  useEffect(() => {
    // Si las dependencias cambian antes de que llegue la respuesta, la vieja
    // se descarta: de lo contrario pisaria a la nueva al resolverse despues.
    let vigente = true;
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));

    ejecutar()
      .then(({ datos, meta }) => {
        if (vigente) setEstado({ datos, meta, cargando: false, error: null });
      })
      .catch((error) => {
        if (vigente) setEstado({ datos: null, meta: null, cargando: false, error });
      });

    return () => {
      vigente = false;
    };
  }, [ejecutar, intento]);

  return { ...estado, recargar };
}
