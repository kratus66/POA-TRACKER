# POA TRACKER

Sistema de seguimiento de POA (Plan Operativo Anual) desarrollado con arquitectura monorepo.

## 📁 Estructura del Proyecto

```
poa-tracker/
├── backend/          # API NestJS + TypeORM + Postgres
├── frontend/         # Next.js + Tailwind CSS
├── docker-compose.yml
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Docker y Docker Compose

### Instalación

1. **Clonar el repositorio**
```bash
cd "c:\Users\Usuario\Documents\POA TRACKER"
```

2. **Levantar la base de datos**
```bash
npm run docker:up
```

3. **Instalar dependencias**
```bash
npm run install:all
```

4. **Iniciar desarrollo**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend

# O ambos con concurrently
npm run dev
```

## 🔗 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/docs
- **Health Check**: http://localhost:4000/health
- **PgAdmin**: http://localhost:5050 (admin@poa.com / admin123)

## 🗄️ Base de Datos

**PostgreSQL**
- Host: localhost
- Puerto: 5432
- Usuario: poauser
- Password: poapass123
- Base de datos: poa_tracker

## 📝 Sprint 0 - Completado

✅ Backend NestJS con TypeORM y Swagger  
✅ Frontend Next.js con Tailwind  
✅ Docker Compose con Postgres  
✅ Health check endpoint  
✅ Layout base con Sidebar y Topbar  

## 🛠️ Tecnologías

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Swagger/OpenAPI

### Frontend
- Next.js 14+
- TypeScript
- Tailwind CSS
- React

### Infraestructura
- Docker
- Docker Compose
- PostgreSQL 15
