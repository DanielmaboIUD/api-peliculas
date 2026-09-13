# Plan por etapas — Monorepo y frontend React

**Proyecto:** Gestión de películas y series — Ingeniería Web II, IU Digital de Antioquia
**Fecha:** 13 de septiembre de 2026
**Estado:** completado

---

## Decisiones tomadas

| Punto | Decisión |
|---|---|
| Estructura | Monorepo con `apps/backend` y `apps/frontend`, usando npm workspaces |
| Repositorio | Se conserva el actual; el backend se mueve con `git mv` para no perder el historial |
| Build del frontend | Vite + React + JavaScript (sin TypeScript) |
| Navegación | React Router, una URL por módulo |
| Estilos | CSS plano con variables, sin librerías |
| Alcance | Panel de administrador de los cinco módulos |

### Qué NO entra en este alcance

- Autenticación, registro y módulos de seguridad (el enunciado los excluye explícitamente).
- Vista pública de catálogo para usuarios finales.
- Despliegue en producción.
- Pruebas automatizadas de frontend.

---

## Estructura final

```
peliculas-monorepo/            <- el repo actual, renombrado
├── package.json               <- raíz: workspaces y scripts
├── .gitignore
├── README.md                  <- portada del monorepo
├── PLAN-FRONTEND.md           <- este archivo
└── apps/
    ├── backend/               <- todo lo que hoy está en la raíz
    │   ├── package.json
    │   ├── .env
    │   ├── .env.example
    │   ├── src/
    │   └── docs/
    └── frontend/
        ├── package.json
        ├── .env.example
        ├── index.html
        ├── vite.config.js
        └── src/
            ├── main.jsx
            ├── App.jsx
            ├── api/
            ├── componentes/
            ├── paginas/
            └── estilos/
```

---

## Etapa 0 — Reestructurar a monorepo

Mover archivos, sin tocar una sola línea del backend.

**Tareas**

1. Crear `apps/backend` y mover con `git mv`: `src/`, `docs/`, `package.json`, `package-lock.json`, `.env.example`, `README.md`.
2. Mover el `.env` a mano (no está versionado).
3. Crear el `package.json` de la raíz:

```json
{
  "name": "peliculas-monorepo",
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "dev:api": "npm run dev --workspace=api-peliculas",
    "dev:web": "npm run dev --workspace=frontend-peliculas"
  }
}
```

4. Mover el `.gitignore` a la raíz y añadir `dist/`.
5. `npm install` desde la raíz: npm crea un único `node_modules` compartido.
6. Escribir el `README.md` de la raíz con la estructura y cómo arrancar cada parte.

**Terminado cuando:** `npm run dev:api` arranca la API desde la raíz del monorepo y `GET /health` responde 200.

**Riesgo:** el `.env` no está versionado, así que `git mv` no lo mueve. Si se olvida, la API arranca y falla al conectar. Comprobarlo antes de seguir.

**Nota aparte:** conviene renombrar el repositorio en GitHub (`api-peliculas` → `peliculas-monorepo`) y actualizar el remote. No es bloqueante.

---

## Etapa 1 — Andamiaje del frontend

**Tareas**

1. `npm create vite@latest apps/frontend -- --template react`
2. Renombrar el paquete a `frontend-peliculas` en su `package.json`.
3. Borrar el boilerplate de Vite: el logo, `App.css` de ejemplo, el contador.
4. Instalar la única dependencia extra: `react-router-dom`.
5. Crear `apps/frontend/.env.example` con `VITE_API_URL=http://localhost:3000/api` y su `.env`.
6. Crear las carpetas vacías: `src/api`, `src/componentes`, `src/paginas`, `src/estilos`.

**Terminado cuando:** `npm run dev:web` levanta Vite en el 5173 y muestra una página propia, sin rastro del boilerplate.

**Decisión técnica:** el frontend habla con la API por su URL completa desde `VITE_API_URL`, no por proxy de Vite. El backend ya tiene `cors()` abierto, así que no hace falta, y así la URL queda explícita y cambiable sin tocar código.

---

## Etapa 2 — Capa de acceso a la API

Una sola puerta de salida al backend. Todo lo demás consume esta capa.

**Tareas**

1. `src/api/cliente.js` — envoltorio de `fetch` que:
   - arma la URL a partir de `VITE_API_URL`;
   - pone `Content-Type: application/json` en POST y PUT;
   - lee la respuesta y devuelve `datos` y `meta` cuando `exito` es `true`;
   - cuando no, lanza un error que **conserva el código HTTP, el `mensaje` y el arreglo `detalles`** de la API. Sin esto los formularios no pueden marcar el campo que falló.
2. `src/api/recursos.js` — una función por operación y por módulo: `listarGeneros`, `crearGenero`, `cambiarEstadoGenero`, `eliminarGenero`, y lo equivalente para los otros cuatro. Son envoltorios de una línea sobre el cliente.
3. `src/api/useRecurso.js` — hook propio con `datos`, `cargando`, `error` y `recargar`. Sin librerías de estado ni de fetching.

**Terminado cuando:** desde un componente de prueba se lista `/api/generos` y se ve la lista en pantalla, y al apagar la API aparece un mensaje de error legible en vez de una pantalla en blanco.

**Por qué esta etapa va antes de la UI:** el backend devuelve un formato único (`exito`, `mensaje`, `meta`, `datos`) y errores con `detalles` por campo. Si no se resuelve aquí, se termina repitiendo el mismo `try/catch` en cinco pantallas.

---

## Etapa 3 — Layout, rutas y estilos base

**Tareas**

1. `src/estilos/variables.css` — paleta, tipografía, espaciado y radios como variables CSS.
2. `src/estilos/base.css` — reset mínimo, tipografía del `body`, estilos de formulario y tabla.
3. `src/componentes/Layout.jsx` — cabecera con el nombre del proyecto y barra lateral con los cinco módulos, marcando el activo.
4. Rutas en `App.jsx`: `/` (resumen), `/generos`, `/directores`, `/productoras`, `/tipos`, `/medias`, y una página 404.
5. Tres componentes de estado que se reutilizan en todas las vistas: `Cargando`, `MensajeError` y `SinDatos`.

**Terminado cuando:** se navega entre los cinco módulos con la URL cambiando, el elemento activo se resalta, y recargar en `/medias` cae en `/medias`.

---

## Etapa 4 — CRUD de los cuatro catálogos

Género, Director, Productora y Tipo comparten forma, así que se construye una vez y se configura cuatro veces.

**Tareas**

1. `src/componentes/Tabla.jsx` — recibe las columnas y las filas, y renderiza la tabla con los botones de acción.
2. `src/componentes/Modal.jsx` — contenedor sencillo para los formularios, con cierre por botón y por `Escape`.
3. `src/componentes/CampoTexto.jsx` — etiqueta, input y hueco para el mensaje de error del campo.
4. `src/paginas/Catalogo.jsx` — la pantalla genérica: listar, crear, editar, activar/desactivar y eliminar.
5. Cuatro páginas delgadas que la configuran con sus campos:
   - **Género:** `nombre`, `descripcion`, `estado`
   - **Director:** `nombres` (en plural, así se llama en la API), `estado`
   - **Productora:** `nombre`, `slogan`, `descripcion`, `estado`
   - **Tipo:** `nombre`, `descripcion` — **sin estado y sin botón de activar/desactivar**, porque el caso de estudio no lo pide y la ruta `PATCH /tipos/:id/estado` no existe
6. Manejo de los errores de la API en la interfaz:
   - **400** → pintar cada `detalles[].campo` junto a su input.
   - **409 por nombre repetido** → mensaje sobre el formulario.
   - **409 al eliminar en uso** → aviso que repite lo que dice la API y ofrece desactivar en vez de borrar.

**Terminado cuando:** los cuatro módulos crean, editan, listan y borran contra la API real; intentar borrar un género usado por una película muestra el aviso con la alternativa; y enviar un formulario vacío marca el campo en rojo con el mensaje que devolvió el backend.

---

## Etapa 5 — Módulo Media

El más grande: diez campos y cuatro relaciones con reglas.

**Tareas**

1. `src/paginas/Medias.jsx` — listado en tarjetas con la imagen de portada, el título, el año y el género. Con respaldo visual si la imagen no carga.
2. `src/paginas/FormularioMedia.jsx` — los diez campos: `serial`, `titulo`, `sinopsis`, `url`, `imagenPortada`, `anioEstreno` y los cuatro desplegables.
3. Los desplegables de Género, Director y Productora se cargan con **`?estado=Activo`**, que es la forma correcta de aplicar la regla del caso de estudio en el cliente: si no aparecen, no se pueden escoger. El de Tipo se carga completo.
4. Aun así, manejar el **400 por referencia inactiva** que puede devolver la API: si alguien desactiva un género desde otra pestaña entre que se cargó el desplegable y se envió el formulario, la API lo rechaza y hay que mostrarlo.
5. Barra de filtros: búsqueda por texto y filtros por género, tipo y año, mapeados a los parámetros que ya acepta la API.
6. Paginación usando el bloque `meta` que devuelve el backend (`total`, `pagina`, `limite`, `paginas`).

**Terminado cuando:** se crea una película desde el formulario escogiendo de los desplegables, se ve en el listado con su portada, los filtros reducen la lista, y desactivar un género hace que desaparezca de las opciones al recargar el formulario.

---

## Etapa 6 — Pulido y cierre

**Tareas**

1. Revisar en pantalla angosta: que la tabla haga scroll horizontal y la barra lateral se pliegue.
2. Validación en cliente que refleje la del backend (campos obligatorios, año entre 1888 y el actual más cinco, URL con formato válido), sin quitar el manejo de los errores del servidor: la validación del cliente es comodidad, la del servidor es la que manda.
3. Repasar accesibilidad básica: `label` asociado a cada input, foco visible, cerrar el modal con `Escape`.
4. `apps/frontend/README.md` con instalación, variables de entorno y estructura.
5. Actualizar el `README.md` de la raíz con capturas del panel.
6. Lista de comprobación manual: recorrer los cinco módulos y verificar que cada código de la API (200, 201, 400, 404, 409) se traduce en algo comprensible en pantalla.
7. Commit y pull request.

**Terminado cuando:** el panel se usa de principio a fin sin abrir la consola del navegador, y ningún error de la API termina en una pantalla en blanco.

---

## Orden de dependencias

```
Etapa 0  →  Etapa 1  →  Etapa 2  →  Etapa 3  →  Etapa 4  →  Etapa 5  →  Etapa 6
monorepo    andamiaje   API        layout      catálogos    media       pulido
```

Las etapas 0 a 3 son cimientos y hay que hacerlas en orden. La 4 y la 5 son independientes entre sí: si hace falta priorizar, la 5 sola ya es demostrable, aunque sin catálogos no habría con qué llenar los desplegables.

---

## Dependencias del frontend

Solo dos, más las que trae Vite:

| Paquete | Para qué |
|---|---|
| `react`, `react-dom` | Vienen con la plantilla de Vite |
| `react-router-dom` | Rutas por módulo |

Sin librerías de estado, de fetching, de formularios, de componentes ni de estilos. Todo lo demás se escribe a mano, que es lo que pide una entrega académica de este curso.

---

## Contrato con la API — referencia rápida

Base: `http://localhost:3000/api`

**Respuesta correcta**

```json
{ "exito": true, "mensaje": "...", "meta": { "total": 0, "pagina": 1, "limite": 10, "paginas": 1 }, "datos": [] }
```

**Respuesta con error**

```json
{ "exito": false, "mensaje": "Error de validacion de datos", "detalles": [ { "campo": "nombre", "mensaje": "El nombre es obligatorio" } ] }
```

| Código | Qué significa para el frontend |
|---|---|
| 200 / 201 | Todo bien; refrescar la lista |
| 400 | Marcar los campos de `detalles` |
| 404 | El registro ya no existe; refrescar |
| 409 | Valor repetido, o borrado de algo en uso |
| 500 | Mensaje genérico y sugerir reintentar |

| Módulo | Rutas | Activar/desactivar |
|---|---|---|
| `/generos` | GET, GET/:id, POST, PUT, DELETE | Sí |
| `/directores` | GET, GET/:id, POST, PUT, DELETE | Sí |
| `/productoras` | GET, GET/:id, POST, PUT, DELETE | Sí |
| `/tipos` | GET, GET/:id, POST, PUT, DELETE | **No** |
| `/medias` | GET, GET/:id, POST, PUT, DELETE | No aplica |

---

## Pendiente que viene de antes

**Rotar la contraseña del usuario de MongoDB Atlas** (`wilsonmarinb_db_user`). Es débil y pasó por una conversación de chat. Se cambia en Atlas → Database Access → Edit Password, y luego se reemplaza en el `.env`. Conviene hacerlo al mover el `.env` en la etapa 0, que es cuando ya hay que tocarlo.
