# POA Tracker - Backend

Backend API construido con NestJS, TypeORM y PostgreSQL.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Variables de Entorno

Copia `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

### Desarrollo

```bash
# Modo desarrollo con hot reload
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 📚 Endpoints

### Health Check
- **GET** `/health` - Verifica el estado del servicio

### Documentación
- **Swagger UI**: http://localhost:4000/docs

## 🗄️ Base de Datos

La aplicación usa TypeORM con PostgreSQL. Las migraciones se ejecutan automáticamente en modo desarrollo (`synchronize: true`).

### Conexión

```typescript
host: localhost
port: 5432
username: poauser
password: poapass123
database: poa_tracker
```

## 📦 Scripts Disponibles

- `npm run start:dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto
- `npm run start:prod` - Inicia el servidor en producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── health/           # Módulo de health check
│   ├── app.module.ts     # Módulo principal
│   └── main.ts           # Punto de entrada
├── .env                  # Variables de entorno
└── package.json
```
