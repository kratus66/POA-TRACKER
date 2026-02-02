# 🧪 Sprint 3 — Guía de Ejecución de Pruebas

## 📝 Instrucciones para Ejecutar las Pruebas

### Opción 1: Usando Docker Compose (RECOMENDADO)

```bash
# 1. Navegar al directorio raíz del proyecto
cd "c:/Users/Usuario/Documents/POA TRACKER"

# 2. Iniciar todos los servicios
docker-compose up

# ✅ Esperar hasta ver en la consola:
#    - "PostgreSQL started"
#    - "Backend listening on port 4000"
#    - "Frontend running on port 3000"
```

### Opción 2: Instalación Local

#### Backend
```bash
cd backend
npm install
npm run start:dev
# ✅ Debe ver: "Nest application successfully started"
```

#### Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
# ✅ Debe ver: "Ready in XXXms"
```

---

## 🧪 Ejecutar Pruebas de API

### Opción A: Script Bash Automático

```bash
# Navegar a la carpeta del proyecto
cd "c:/Users/Usuario/Documents/POA TRACKER"

# Hacer el script ejecutable
chmod +x test-sprint3.sh

# Ejecutar
bash test-sprint3.sh
```

**Resultado esperado:**
```
═══════════════════════════════════════════════════════
  Sprint 3 - POA Tracker Testing Suite
═══════════════════════════════════════════════════════

[TEST 1] Health Check
✅ Backend is running

[TEST 2] Authentication
✅ Authentication successful
   Token: eyJhbGciOiJIUzI1NiIs...

[TEST 3] GET /programs
✅ GET /programs successful
   Found: 3 programs
   First program ID: 550e8400-e29b-41d4-a716-446655440010

[TEST 4] POST /poa-templates
✅ POST /poa-templates successful
   Template ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

... (más tests)

✅ TESTING COMPLETED
```

---

### Opción B: Pruebas Manuales con CURL

#### 1️⃣ Verificar Health

```bash
curl -s http://localhost:4000/health | jq .
```

**Respuesta esperada:**
```json
{
  "status": "UP"
}
```

#### 2️⃣ Login para obtener JWT Token

```bash
curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "firstName": "Admin",
    "role": "ADMIN"
  }
}
```

**💾 Guardar el token:**
```bash
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 3️⃣ Obtener Programas

```bash
curl -s -X GET http://localhost:4000/programs \
  -H "Authorization: Bearer $JWT_TOKEN" | jq .
```

**Respuesta esperada:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "name": "Renta Ciudadana",
      "description": "Programa de renta ciudadana",
      "active": true
    }
  ],
  "pagination": {...}
}
```

**💾 Guardar programa ID:**
```bash
export PROGRAM_ID="550e8400-e29b-41d4-a716-446655440010"
```

#### 4️⃣ Crear Plantilla POA

```bash
curl -s -X POST http://localhost:4000/poa-templates \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plantilla Test 2025",
    "description": "Plantilla para pruebas"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Plantilla Test 2025",
  "description": "Plantilla para pruebas",
  "active": true,
  "activities": [],
  "createdAt": "2025-01-30T...",
  "updatedAt": "2025-01-30T..."
}
```

**💾 Guardar template ID:**
```bash
export TEMPLATE_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

#### 5️⃣ Agregar Actividad a Plantilla

```bash
curl -s -X POST http://localhost:4000/poa-templates/$TEMPLATE_ID/activities \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beneficiarios atendidos",
    "description": "Número de personas beneficiadas",
    "meta": 1000,
    "unit": "personas",
    "programId": "'$PROGRAM_ID'"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "id": "activity-uuid",
  "name": "Beneficiarios atendidos",
  "description": "Número de personas beneficiadas",
  "meta": 1000,
  "unit": "personas",
  "templateId": "a1b2c3d4-...",
  "programId": "550e8400-...",
  "createdAt": "2025-01-30T...",
  "updatedAt": "2025-01-30T..."
}
```

#### 6️⃣ Obtener Plantilla Completa

```bash
curl -s -X GET http://localhost:4000/poa-templates/$TEMPLATE_ID \
  -H "Authorization: Bearer $JWT_TOKEN" | jq .
```

**Respuesta esperada:**
```json
{
  "id": "a1b2c3d4-...",
  "name": "Plantilla Test 2025",
  "activities": [
    {
      "id": "activity-uuid",
      "name": "Beneficiarios atendidos",
      "meta": 1000,
      "unit": "personas",
      "program": {
        "id": "550e8400-...",
        "name": "Renta Ciudadana"
      }
    }
  ]
}
```

#### 7️⃣ Obtener Convenios

```bash
curl -s -X GET http://localhost:4000/agreements \
  -H "Authorization: Bearer $JWT_TOKEN" | jq .
```

**💾 Guardar agreement ID:**
```bash
export AGREEMENT_ID=$(curl -s -X GET http://localhost:4000/agreements \
  -H "Authorization: Bearer $JWT_TOKEN" | jq -r '.data[0].id')
```

#### 8️⃣ APLICAR PLANTILLA A CONVENIO (CRITICAL TEST)

```bash
curl -s -X POST http://localhost:4000/agreements/$AGREEMENT_ID/apply-template/$TEMPLATE_ID?year=2025 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
```

**Respuesta esperada:**
```json
{
  "poaPeriod": {
    "id": "poa-uuid",
    "year": 2025,
    "status": "DRAFT",
    "agreementId": "agreement-uuid"
  },
  "activities": [
    {
      "id": "new-activity-uuid",
      "name": "Beneficiarios atendidos",
      "meta": 1000,
      "unit": "personas",
      "programId": "550e8400-...",
      "poaPeriodId": "poa-uuid",
      "templateActivityId": "activity-uuid",
      "status": "PENDING",
      "progress": 0
    }
  ],
  "templateId": "a1b2c3d4-..."
}
```

**💾 Guardar POA Period y Activity ID:**
```bash
export POA_ID="poa-uuid"
export ACTIVITY_ID="new-activity-uuid"
```

#### 9️⃣ Obtener Actividades del POA

```bash
curl -s -X GET "http://localhost:4000/agreement-activities?poaPeriodId=$POA_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq .
```

**Respuesta esperada:**
```json
{
  "data": [
    {
      "id": "new-activity-uuid",
      "name": "Beneficiarios atendidos",
      "meta": 1000,
      "unit": "personas",
      "progress": 0,
      "status": "PENDING",
      "poaPeriodId": "poa-uuid",
      "programId": "550e8400-...",
      "program": {
        "id": "550e8400-...",
        "name": "Renta Ciudadana"
      }
    }
  ],
  "pagination": {...}
}
```

#### 🔟 Actualizar Actividad

```bash
curl -s -X PATCH http://localhost:4000/agreement-activities/$ACTIVITY_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 50,
    "status": "IN_PROGRESS"
  }' | jq .
```

**Respuesta esperada:**
```json
{
  "id": "new-activity-uuid",
  "name": "Beneficiarios atendidos",
  "meta": 1000,
  "unit": "personas",
  "progress": 50,
  "status": "IN_PROGRESS",
  "poaPeriodId": "poa-uuid",
  "programId": "550e8400-...",
  "updatedAt": "2025-01-30T..."
}
```

---

## 🎨 Pruebas en Frontend

### 1️⃣ Abrir Frontend
```
http://localhost:3000
```

### 2️⃣ Login
```
Email: admin@example.com (o supervisor@example.com)
Password: admin123
```

### 3️⃣ Ir a Plantillas POA
```
Menu → Plantillas POA
Ruta: http://localhost:3000/poa-templates
```

**Verificar:**
- ✅ Botón "+ Crear Plantilla"
- ✅ Lista de plantillas (si existen)
- ✅ Buscar plantilla

### 4️⃣ Crear Plantilla
```
Click: "+ Crear Plantilla"
Nombre: "Mi Primera Plantilla"
Descripción: "Para prueba"
Click: Crear
```

**Verificar:**
- ✅ Plantilla aparece en lista
- ✅ Mensaje de éxito

### 5️⃣ Agregar Actividades
```
Click: "Plantilla creada"
Click: "+ Agregar Actividad"
Programa: "Renta Ciudadana"
Nombre: "Beneficiarios"
Meta: 1000
Unidad: "personas"
Click: Agregar
```

**Verificar:**
- ✅ Actividad aparece en tabla
- ✅ Datos correctos

### 6️⃣ Ir a Detalle Convenio
```
Menu → Convenios
Seleccionar un convenio
Ruta: http://localhost:3000/agreements/[id]
```

### 7️⃣ Aplicar Plantilla (KEY TEST)
```
Sección: "Aplicar Plantilla POA"
Vigencia: "POA 2025"
Plantilla: "Mi Primera Plantilla"
Click: "Aplicar Plantilla"
```

**Verificar:**
- ✅ Mensaje "Plantilla aplicada exitosamente"
- ✅ Actividades creadas

### 8️⃣ Ver Actividades Agrupadas (FEATURE KEY)
```
Sección: "Actividades del POA"
Selector: "POA 2025"
```

**Verificar:**
- ✅ Actividades agrupadas por programa
- ✅ Encabezados por programa (Renta Ciudadana, etc)
- ✅ Tabla con columnas: Actividad, Meta, Unidad, Avance, Estado
- ✅ **ESTO DEBE VERSE COMO EL EXCEL ORIGINAL**

### 9️⃣ Editar Actividad
```
Cambiar: Avance de 0 a 50
Cambiar: Estado a "IN_PROGRESS"
Click: "Guardar"
```

**Verificar:**
- ✅ Mensaje de éxito
- ✅ Datos actualizados en tabla
- ✅ Cambios persisten al recargar

---

## 📋 Checklist de Verificación

### Backend
- [ ] Health check responde ✅
- [ ] Login funciona ✅
- [ ] GET /programs retorna datos ✅
- [ ] POST /poa-templates crea plantilla ✅
- [ ] POST /poa-templates/:id/activities crea actividad ✅
- [ ] GET /poa-templates/:id retorna con actividades ✅
- [ ] GET /agreements retorna convenios ✅
- [ ] POST /agreements/:id/apply-template/:templateId copia actividades ✅
- [ ] GET /agreement-activities retorna actividades creadas ✅
- [ ] PATCH /agreement-activities/:id actualiza datos ✅

### Frontend - Plantillas
- [ ] Página /poa-templates carga ✅
- [ ] Botón "+ Crear Plantilla" funciona ✅
- [ ] Crear plantilla guarda correctamente ✅
- [ ] Plantilla aparece en lista ✅
- [ ] Botón "Agregar Actividad" abre formulario ✅
- [ ] Selector de programa funciona ✅
- [ ] Agregar actividad persiste ✅
- [ ] Actividades se muestran en tabla ✅

### Frontend - Convenios
- [ ] Página detalle convenio carga ✅
- [ ] Sección "Aplicar Plantilla POA" visible ✅
- [ ] Selector de vigencia funciona ✅
- [ ] Selector de plantilla funciona ✅
- [ ] Botón "Aplicar Plantilla" ejecuta ✅
- [ ] Actividades se crean y muestran ✅
- [ ] Actividades están AGRUPADAS POR PROGRAMA ✅✨
- [ ] Edición de avance funciona ✅
- [ ] Edición de estado funciona ✅
- [ ] Guardar cambios persiste datos ✅

---

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar Node.js
node -v

# Instalar dependencias
cd backend
npm install

# Iniciar en debug
npm run start:dev
```

### Puerto 4000 ocupado
```bash
# Encontrar proceso usando puerto 4000
netstat -ano | findstr :4000

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F

# O cambiar puerto en .env
DB_URL=...
PORT=4001
```

### Base de datos no responde
```bash
# Si usa Docker
docker-compose restart postgres

# O verifique credenciales en .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=...
```

### Frontend no conecta con backend
```bash
# Verificar NEXT_PUBLIC_API_URL en .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000

# Limpiar caché
rm -rf .next
npm run dev
```

---

## ⏱️ Tiempo Esperado

- **Setup inicial**: 5-10 minutos
- **Script de pruebas**: 2-3 minutos
- **Pruebas manuales**: 10-15 minutos
- **Pruebas frontend**: 10-15 minutos

**Total**: 30-45 minutos para testing completo

---

## 📊 Resultado Esperado Final

Después de todas las pruebas deberías ver:

✅ 10/10 tests de API pasando  
✅ Frontend cargando correctamente  
✅ **Actividades agrupadas por programa** en detalle convenio  
✅ Edición de actividades funcionando  
✅ Cambios persistidos en base de datos  

**= Sprint 3 Verificado y Funcional ✨**

---

**¿Necesitas ayuda ejecutando estas pruebas? Avísame cuál preferirías.**
