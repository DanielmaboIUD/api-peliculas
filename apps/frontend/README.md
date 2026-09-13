# Panel de administración

Interfaz web en React para gestionar los cinco módulos de la API: géneros, directores, productoras, tipos y producciones.

Construida con Vite, React y React Router. Sin librerías de estado, formularios, componentes ni estilos: el CSS es plano, con variables.

## Requisitos

- Node.js 20.19 o 22.12 en adelante, que es lo que exige Vite 8.
- La API del monorepo en marcha (`apps/backend`).

## Instalación

Las dependencias se instalan desde la raíz del monorepo:

```bash
npm install
copy apps\frontend\.env.example apps\frontend\.env
```

## Variables de entorno

| Variable | Valor por defecto | Para qué |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de la API |

El panel llama a la API por su URL completa, sin proxy de Vite. El backend tiene CORS abierto.

## Ejecución

Desde la raíz del monorepo:

```bash
npm run dev:web                                  # desarrollo en http://localhost:5173
npm run build --workspace=frontend-peliculas     # compilación en apps/frontend/dist
```

## Estructura

```
src/
├── main.jsx            punto de entrada y estilos globales
├── App.jsx             rutas
├── validacion.js       reglas de cliente que reflejan las del backend
├── api/
│   ├── cliente.js      envoltorio de fetch y clase ErrorApi
│   ├── recursos.js     una función por operación de cada módulo
│   └── useRecurso.js   hook de lectura: datos, meta, cargando, error, recargar
├── componentes/        Layout, Tabla, Modal, CampoTexto y estados (Cargando, MensajeError, SinDatos)
├── paginas/            Resumen, Catalogo y sus cuatro módulos, Medias, FormularioMedia, 404
└── estilos/            variables, base, componentes, layout y medias
```

Género, Director, Productora y Tipo comparten la pantalla `Catalogo.jsx`; cada uno solo declara sus campos.

## Manejo de errores

Toda llamada pasa por `api/cliente.js`. Si la respuesta trae `exito: true`, devuelve `datos` y `meta`; si no, lanza un `ErrorApi` que conserva el código HTTP, el mensaje y el arreglo `detalles` de la API.

La validación de cliente (`validacion.js`) produce un error con la misma forma, así que los formularios pintan igual un fallo detectado antes de enviar que uno devuelto por el servidor. Es solo comodidad: la validación que manda es la del backend.

## Comprobación manual

Recorrido hecho contra la API real, módulo por módulo.

| Código | Caso probado | Qué muestra el panel |
|---|---|---|
| 200 | Listar, editar, activar o desactivar | La lista se actualiza |
| 201 | Crear en los cinco módulos | El registro aparece en la lista |
| 400 | Formulario vacío, URL o año inválidos | Cada campo en rojo con su mensaje |
| 400 | Género desactivado mientras se llenaba el formulario de una producción | El motivo bajo el desplegable de género |
| 404 | Editar o desactivar un registro borrado desde otra pestaña | El mensaje de la API, y la lista se refresca |
| 409 | Nombre o serial repetido | Aviso sobre el formulario |
| 409 | Borrar un género en uso | Aviso con la opción «Desactivar en su lugar» |
| 500 | Respuesta simulada | Mensaje genérico con botón «Reintentar» |
| — | API apagada | «No hay conexión» con botón «Reintentar» |

También se revisó:

- En pantalla angosta (375 px), la barra lateral pasa a una fila con desplazamiento, las tablas se desplazan horizontalmente y los formularios y filtros quedan en una columna.
- Cada campo tiene su `label` asociado, y los botones de las filas nombran el registro («Editar Drama»).
- El foco es visible, `Escape` cierra los modales y el foco vuelve al botón que los abrió.
