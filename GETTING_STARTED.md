# 🚀 Guía de Inicio - POA Tracker

Esta guía te ayudará a poner en marcha el proyecto POA Tracker en tu máquina local.

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** 18 o superior - [Descargar](https://nodejs.org/)
- **npm** (viene con Node.js)
- **Docker** y **Docker Compose** - [Descargar](https://www.docker.com/products/docker-desktop)

## 🛠️ Instalación Paso a Paso

### 1️⃣ Levantar la Base de Datos

Primero, inicia PostgreSQL usando Docker Compose:

```bash
# Desde la raíz del proyecto
npm run docker:up
```

Esto iniciará:
- **PostgreSQL** en `localhost:5432`
- **PgAdmin** en `localhost:5050`

Para verificar que está corriendo:
```bash
docker ps
```

### 2️⃣ Instalar Dependencias

Instala las dependencias de todo el proyecto:

```bash
npm run install:all
```

O instala manualmente en cada carpeta:

```bash
# Raíz
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 3️⃣ Iniciar el Backend

Abre una terminal y ejecuta:

```bash
npm run dev:backend
```

O manualmente:
```bash
cd backend
npm run start:dev
```

Verifica que funciona visitando:
- http://localhost:4000/health
- http://localhost:4000/docs (Swagger)

### 4️⃣ Iniciar el Frontend

Abre **otra terminal** y ejecuta:

```bash
npm run dev:frontend
```

O manualmente:
```bash
cd frontend
npm run dev
```

Abre tu navegador en: http://localhost:3000

## ✅ Verificar la Instalación

### Test del Backend

1. Ve a http://localhost:4000/docs
2. Deberías ver la documentación de Swagger
3. Prueba el endpoint `/health`

### Test del Frontend

1. Ve a http://localhost:3000
2. Haz clic en el botón **"Probar Backend"**
3. Deberías ver una respuesta JSON con el estado del backend

### Test de la Base de Datos

**Opción 1: PgAdmin**
1. Ve a http://localhost:5050
2. Login: `admin@poa.com` / `admin123`
3. Conecta al servidor:
   - Host: `postgres`
   - Port: `5432`
   - Username: `poauser`
   - Password: `poapass123`

**Opción 2: Línea de comandos**
```bash
docker exec -it poa-tracker-db psql -U poauser -d poa_tracker
```

## 🎯 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3000 | Aplicación web |
| Backend API | http://localhost:4000 | API REST |
| Swagger | http://localhost:4000/docs | Documentación API |
| Health Check | http://localhost:4000/health | Estado del backend |
| PgAdmin | http://localhost:5050 | Administrador de BD |

## 🐛 Solución de Problemas

### El backend no conecta a la base de datos

1. Verifica que Docker esté corriendo:
   ```bash
   docker ps
   ```

2. Si no ves el contenedor `poa-tracker-db`, reinicia Docker Compose:
   ```bash
   npm run docker:down
   npm run docker:up
   ```

### Puerto 4000 o 3000 ya en uso

Cambia los puertos en los archivos `.env`:

**Backend** (`backend/.env`):
```
PORT=4001
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:4001
```

Y actualiza el comando de Next.js:
```bash
cd frontend
PORT=3001 npm run dev
```

### Error al instalar dependencias

Limpia la caché de npm:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Comandos Útiles

### Detener servicios

```bash
# Detener Docker
npm run docker:down

# Detener backend/frontend
Ctrl + C en la terminal correspondiente
```

### Reiniciar todo

```bash
# Detener Docker
npm run docker:down

# Limpiar y reinstalar
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all

# Reiniciar Docker
npm run docker:up

# Iniciar desarrollo
npm run dev
```

### Ver logs de Docker

```bash
docker logs poa-tracker-db
docker logs poa-tracker-pgadmin
```

## 📚 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ Explora el dashboard en http://localhost:3000
2. ✅ Revisa la documentación de Swagger en http://localhost:4000/docs
3. ✅ Familiarízate con la estructura del código
4. ✅ Espera las instrucciones del Sprint 1

## 💡 Tips

- Usa **VS Code** como editor con las extensiones:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Hero

- Mantén siempre **3 terminales abiertas**:
  1. Docker (si es necesario)
  2. Backend (`npm run dev:backend`)
  3. Frontend (`npm run dev:frontend`)

- Los cambios en el código se reflejan automáticamente (hot reload)

---

¿Necesitas ayuda? Revisa los README.md en `/backend` y `/frontend` para más detalles.
