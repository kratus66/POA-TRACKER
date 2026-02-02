# 🚀 INICIO RÁPIDO - Ejecutar Pruebas Sprint 3

## 📋 Tabla de Contenidos
1. [Opción 1: Rápido con Docker Desktop](#opción-1-docker-desktop-recomendado)
2. [Opción 2: Manual Local](#opción-2-instalación-local)
3. [Opción 3: Pruebas Manuales con CURL](#opción-3-pruebas-manuales)

---

## Opción 1: Docker Desktop (RECOMENDADO)

### ✅ Requisitos Previos
- Docker Desktop instalado y ejecutándose
- Terminal/CMD disponible

### 📝 Pasos

#### 1️⃣ Abrir Docker Desktop
```
Click: Icono Docker en bandeja del sistema
Esperar: "Docker is running"
```

#### 2️⃣ Ir al directorio del proyecto
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER"
```

#### 3️⃣ Iniciar los servicios
```bash
docker-compose up -d
```

**Esperar:** 30-60 segundos

#### 4️⃣ Verificar que todo está corriendo
```bash
docker-compose ps
```

**Deberías ver:**
```
NAME                   STATUS
poa-tracker-db        Up (healthy)
poa-tracker-pgadmin   Up
poa-tracker-backend   Up
poa-tracker-frontend  Up
```

#### 5️⃣ Ejecutar pruebas
```bash
bash run-tests.sh
```

O especificar URL diferente:
```bash
bash run-tests.sh http://localhost:4000
```

#### 6️⃣ Ver resultados
```
═══════════════════════════════════════════════════════
   🧪 Sprint 3 - POA Tracker Testing Suite
═══════════════════════════════════════════════════════

[TEST 1] Health Check
✓ PASSED

[TEST 2] Authentication (Login)
✓ PASSED
Token obtained: eyJhbGciOiJIUzI1NiIs...

... (más tests)

✨ ALL TESTS PASSED! (100%)
Sprint 3 implementation verified successfully!
```

#### 7️⃣ Detener servicios
```bash
docker-compose down
```

---

## Opción 2: Instalación Local

### ✅ Requisitos Previos
- Node.js 18+ instalado
- npm o yarn
- PostgreSQL corriendo (o Docker con postgres)

### 📝 Pasos

#### 1️⃣ Abrir dos terminales

**Terminal 1: Backend**
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER/backend"
npm install
npm run start:dev
```

**Esperar:** Ver mensaje:
```
[Nest] 1234  - 01/30/2025, 10:30:00 AM     LOG [NestFactory] Nest application successfully started +0ms
```

**Terminal 2: Pruebas**
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER"
bash run-tests.sh
```

#### 2️⃣ Ver Frontend (opcional)

**Terminal 3: Frontend**
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER/frontend"
npm install
npm run dev
```

Luego ir a: http://localhost:3000

---

## Opción 3: Pruebas Manuales

### ✅ Si prefieres hacerlo paso a paso con CURL

#### 1️⃣ Health Check
```bash
curl -i http://localhost:4000/health
```

**Respuesta esperada:**
```
HTTP/1.1 200 OK
{
  "status": "UP"
}
```

#### 2️⃣ Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -i
```

**Guardar el token (reemplaza XXX):**
```bash
set JWT_TOKEN=eyJhbGciOiJIUzI1NiIs...XXX
```

#### 3️⃣ Obtener Programas
```bash
curl -i http://localhost:4000/programs \
  -H "Authorization: Bearer %JWT_TOKEN%"
```

#### 4️⃣ Crear Plantilla
```bash
curl -X POST http://localhost:4000/poa-templates \
  -H "Authorization: Bearer %JWT_TOKEN%" \
  -H "Content-Type: application/json" \
  -d '{"name":"Plantilla Test","description":"Test"}' \
  -i
```

#### 5️⃣ Agregar Actividad (reemplaza TEMPLATE_ID)
```bash
curl -X POST http://localhost:4000/poa-templates/{TEMPLATE_ID}/activities \
  -H "Authorization: Bearer %JWT_TOKEN%" \
  -H "Content-Type: application/json" \
  -d '{"name":"Beneficiarios","meta":1000,"unit":"personas","programId":"550e8400-e29b-41d4-a716-446655440010"}' \
  -i
```

#### 6️⃣ Obtener Convenios
```bash
curl -i http://localhost:4000/agreements \
  -H "Authorization: Bearer %JWT_TOKEN%"
```

#### 7️⃣ APLICAR PLANTILLA (El test más importante)
```bash
curl -X POST "http://localhost:4000/agreements/{AGREEMENT_ID}/apply-template/{TEMPLATE_ID}?year=2025" \
  -H "Authorization: Bearer %JWT_TOKEN%" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -i
```

#### 8️⃣ Obtener Actividades del POA
```bash
curl -i "http://localhost:4000/agreement-activities?poaPeriodId={POA_ID}" \
  -H "Authorization: Bearer %JWT_TOKEN%"
```

#### 9️⃣ Actualizar Actividad
```bash
curl -X PATCH "http://localhost:4000/agreement-activities/{ACTIVITY_ID}" \
  -H "Authorization: Bearer %JWT_TOKEN%" \
  -H "Content-Type: application/json" \
  -d '{"progress":50,"status":"IN_PROGRESS"}' \
  -i
```

---

## 🖥️ Pruebas en Frontend

Una vez que todo esté corriendo:

### 1️⃣ Abrir aplicación
```
http://localhost:3000
```

### 2️⃣ Login
```
Email: admin@example.com
Password: admin123
```

### 3️⃣ Probar Plantillas
```
Menú → Plantillas POA
```

- Crear nueva plantilla
- Agregar actividades
- Editar actividades

### 4️⃣ Probar Aplicar Plantilla (CRITICAL)
```
Menú → Convenios
Seleccionar un convenio
```

- Click en detalle
- Sección "Aplicar Plantilla POA"
- **Seleccionar vigencia y plantilla**
- **Hacer click "Aplicar Plantilla"**
- **Ver actividades AGRUPADAS POR PROGRAMA** ✨

### 5️⃣ Probar Editar Actividades
```
En la misma sección "Actividades del POA"
```

- Cambiar avance (progress)
- Cambiar estado (status)
- Guardar cambios
- Recargar página para verificar persistencia

---

## ⚙️ Solución de Problemas

### ❌ "Connection refused" en puerto 4000
```bash
# Verificar si algo está ocupando el puerto
netstat -ano | findstr :4000

# Si algo está usando el puerto:
taskkill /PID {PID} /F

# O cambiar puerto en .env del backend
PORT=4001
```

### ❌ Docker: "Cannot connect to Docker daemon"
- Verificar que Docker Desktop está corriendo
- Reiniciar Docker Desktop
- Reiniciar computadora

### ❌ "Database connection refused"
```bash
# Opción 1: Usar docker para base de datos
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15

# Opción 2: Cambiar conexión en .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### ❌ "Cannot find module" en backend
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### ❌ Tests no se pueden ejecutar en PowerShell
```bash
# Cambiar a bash (si tienes Git Bash instalado)
"c:/Program Files/Git/bin/bash.exe" run-tests.sh

# O usar WSL2:
wsl bash run-tests.sh
```

---

## 📊 Checklist Final

Después de ejecutar pruebas:

- [ ] Health check responde ✅
- [ ] Login funciona ✅
- [ ] Programas se obtienen ✅
- [ ] Plantilla se crea ✅
- [ ] Actividad se agrega ✅
- [ ] Template se obtiene con actividades ✅
- [ ] Convenios se obtienen ✅
- [ ] **Plantilla se aplica a convenio** ✅ ← CRITICAL
- [ ] **Actividades se copian a agreement-activities** ✅ ← CRITICAL
- [ ] Actividad se actualiza correctamente ✅

**Si todos pasan → Sprint 3 verificado ✨**

---

## 📞 Necesitas ayuda?

Si algo no funciona:

1. Compartir el **error exacto** que ves
2. Decir qué **opción estás usando** (Docker/Local/Manual)
3. Compartir la **salida de la terminal**

Estaré aquí para ayudar.

---

**Última actualización:** 30/01/2025  
**Sprint:** 3 - Plantillas POA + Instanciar Actividades  
**Status:** 🟢 Listo para Testing
