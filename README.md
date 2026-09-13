# Gestión de películas y series

Proyecto de **Ingeniería Web II** — IU Digital de Antioquia.

El repositorio es un monorepo con dos aplicaciones: la API REST y el panel web que la consume.

## Estructura

```
peliculas-monorepo/
├── package.json          <- workspaces y scripts de arranque
├── PLAN-FRONTEND.md      <- plan por etapas del frontend
└── apps/
    ├── backend/          <- API REST (Node + Express + MongoDB)
    └── frontend/         <- panel de administración (React + Vite)
```

Las dependencias de las dos aplicaciones se instalan juntas en un único `node_modules` de la raíz, gracias a los *workspaces* de npm.

## Puesta en marcha

Una sola instalación desde la raíz, para todo el monorepo:

```bash
npm install
```

Después, cada aplicación necesita su archivo de variables de entorno:

```bash
copy apps\backend\.env.example apps\backend\.env
```

En `apps/backend/.env` se ajusta `MONGO_URI` con la cadena de conexión a MongoDB.

## Ejecución

Desde la raíz, en dos terminales distintas:

```bash
npm run dev:api     # API en http://localhost:3000
npm run dev:web     # panel en http://localhost:5173
```

Para comprobar que la API responde:

```
GET http://localhost:3000/health
```

`npm run start:api` arranca la API sin nodemon.

## Las dos aplicaciones

| Aplicación | Carpeta | Paquete | Documentación |
|---|---|---|---|
| API REST | `apps/backend` | `api-peliculas` | [README](apps/backend/README.md) |
| Panel web | `apps/frontend` | `frontend-peliculas` | pendiente |

El detalle del modelo de datos, los endpoints y los códigos de respuesta está en el README del backend.
