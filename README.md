# API REST de Películas y Series

Actividad **S20 - EA1: API REST - NodeJs** — Ingeniería Web II, IU Digital de Antioquia.

API REST con Node.js + Express + MongoDB (Mongoose) para los cinco módulos del caso de estudio: **Género, Director, Productora, Tipo y Media**.

## Instalación

```bash
npm install
copy .env.example .env
```

Ajustar `MONGO_URI` en el `.env`:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/peliculas_db
```

## Ejecución

```bash
npm run dev     # desarrollo (nodemon)
npm start       # normal
```

La API queda en `http://localhost:3000`.

## Modelo de datos

Cinco colecciones. `medias` se relaciona con las otras cuatro por `ObjectId`.

| Colección | Campos |
|---|---|
| `generos` | nombre (único), estado, descripcion, fechaCreacion, fechaActualizacion |
| `directores` | nombres, estado, fechaCreacion, fechaActualizacion |
| `productoras` | nombre (único), estado, slogan, descripcion, fechaCreacion, fechaActualizacion |
| `tipos` | nombre (único), descripcion, fechaCreacion, fechaActualizacion |
| `medias` | serial (único), titulo, sinopsis, url (única), imagenPortada, anioEstreno, genero, director, productora, tipo, fechaCreacion, fechaActualizacion |

`estado` acepta `Activo` o `Inactivo`. El módulo Tipo no maneja estado porque el caso de estudio no lo pide.

**Regla del caso:** al crear o editar una producción solo se aceptan género, director y productora en estado `Activo`.

**Integridad referencial:** no se puede eliminar un género, director, productora o tipo que alguna producción esté usando; la API responde `409`. Para retirarlo del catálogo sin borrar el historial se usa `PATCH /:id/estado`.

## Endpoints

Base: `http://localhost:3000/api`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/generos` | Listar |
| GET | `/generos/:id` | Consultar uno |
| POST | `/generos` | Crear |
| PUT | `/generos/:id` | Actualizar |
| PATCH | `/generos/:id/estado` | Activar / desactivar |
| DELETE | `/generos/:id` | Eliminar |

Los módulos `/directores` y `/productoras` tienen exactamente las mismas operaciones.

`/tipos` tiene las mismas **sin** `PATCH /:id/estado`.

`/medias` tiene GET, GET `/:id`, POST, PUT y DELETE.

## Ejemplo

```http
POST /api/medias
Content-Type: application/json

{
  "serial": "MOV-0001",
  "titulo": "Interstellar",
  "sinopsis": "Un grupo de exploradores viaja más allá de nuestra galaxia.",
  "url": "https://peliculas.iudigital.edu.co/interstellar",
  "imagenPortada": "https://peliculas.iudigital.edu.co/portadas/interstellar.jpg",
  "anioEstreno": 2014,
  "genero": "<id del género>",
  "director": "<id del director>",
  "productora": "<id de la productora>",
  "tipo": "<id del tipo>"
}
```

Todas las respuestas usan el mismo formato:

```json
{ "exito": true, "mensaje": "...", "datos": { } }
```

## Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Consulta, actualización o eliminación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos, id mal formado o referencia inactiva |
| 404 | No encontrado |
| 409 | Valor duplicado en un campo único, o intento de eliminar un registro en uso |
| 500 | Error interno |

## Pruebas en Postman

1. Import → `docs/API-Peliculas.postman_collection.json`
2. Verificar que la variable `baseUrl` sea `http://localhost:3000`.
3. Ejecutar la carpeta **6. Flujo completo sugerido**: cada POST guarda el id creado en una variable, así que al llegar a la producción ya tiene las referencias listas.
