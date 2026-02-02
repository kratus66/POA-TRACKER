# Sprint 3 — Testing Guide

## 🧪 Pruebas de Endpoints

### 1. **Crear Plantilla POA**

**Endpoint:** `POST /poa-templates`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Plantilla Q1 2025",
  "description": "Plantilla trimestral para enero-marzo 2025"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Plantilla Q1 2025",
  "description": "Plantilla trimestral para enero-marzo 2025",
  "active": true,
  "activities": [],
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

---

### 2. **Agregar Actividad a Plantilla**

**Endpoint:** `POST /poa-templates/{TEMPLATE_ID}/activities`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Beneficiarios Renta Ciudadana",
  "description": "Número de personas beneficiadas",
  "meta": 1500,
  "unit": "personas",
  "programId": "550e8400-e29b-41d4-a716-446655440010"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440020",
  "name": "Beneficiarios Renta Ciudadana",
  "description": "Número de personas beneficiadas",
  "meta": 1500,
  "unit": "personas",
  "templateId": "550e8400-e29b-41d4-a716-446655440001",
  "programId": "550e8400-e29b-41d4-a716-446655440010",
  "createdAt": "2025-01-30T10:31:00Z",
  "updatedAt": "2025-01-30T10:31:00Z"
}
```

**Test Cases:**
- ✅ Programa existe
- ❌ Programa no existe (debe devolver 400)
- ❌ Plantilla no existe (debe devolver 400)

---

### 3. **Listar Actividades de Plantilla**

**Endpoint:** `GET /poa-templates/{TEMPLATE_ID}/activities`

**Expected Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "name": "Beneficiarios Renta Ciudadana",
    "description": "Número de personas beneficiadas",
    "meta": 1500,
    "unit": "personas",
    "templateId": "550e8400-e29b-41d4-a716-446655440001",
    "programId": "550e8400-e29b-41d4-a716-446655440010",
    "program": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "name": "Renta Ciudadana"
    }
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440021",
    "name": "Trámites Compensación IVA",
    "description": "Solicitudes de compensación procesadas",
    "meta": 800,
    "unit": "trámites",
    "templateId": "550e8400-e29b-41d4-a716-446655440001",
    "programId": "550e8400-e29b-41d4-a716-446655440011",
    "program": {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "name": "Compensación IVA"
    }
  }
]
```

---

### 4. **Obtener Plantilla Completa**

**Endpoint:** `GET /poa-templates/{TEMPLATE_ID}`

**Expected Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Plantilla Q1 2025",
  "description": "Plantilla trimestral para enero-marzo 2025",
  "active": true,
  "activities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "name": "Beneficiarios Renta Ciudadana",
      "meta": 1500,
      "unit": "personas",
      "program": {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Renta Ciudadana"
      }
    }
  ],
  "createdAt": "2025-01-30T10:30:00Z",
  "updatedAt": "2025-01-30T10:30:00Z"
}
```

---

### 5. **Aplicar Plantilla a Convenio**

**Endpoint:** `POST /agreements/{AGREEMENT_ID}/apply-template/{TEMPLATE_ID}`

**Query Parameters:**
```
?year=2025 (opcional)
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Expected Response (201 Created):**
```json
{
  "poaPeriod": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "year": 2025,
    "status": "DRAFT",
    "agreementId": "550e8400-e29b-41d4-a716-446655440100",
    "supervisorId": null,
    "notes": "POA para el año 2025"
  },
  "activities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "name": "Beneficiarios Renta Ciudadana",
      "description": "Número de personas beneficiadas",
      "meta": 1500,
      "unit": "personas",
      "progress": 0,
      "status": "PENDING",
      "poaPeriodId": "550e8400-e29b-41d4-a716-446655440030",
      "programId": "550e8400-e29b-41d4-a716-446655440010",
      "templateActivityId": "550e8400-e29b-41d4-a716-446655440020"
    }
  ],
  "templateId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Test Cases:**
- ✅ Aplicar con año específico (2025)
- ✅ Aplicar sin año (usa año actual)
- ❌ Plantilla sin actividades (error 400)
- ❌ Actividades previas existen (error 400)
- ❌ Convenio no existe (error 400)

---

### 6. **Obtener Actividades del POA por Período**

**Endpoint:** `GET /agreement-activities?poaPeriodId={POA_PERIOD_ID}&page=1&limit=20`

**Expected Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "name": "Beneficiarios Renta Ciudadana",
      "description": "Número de personas beneficiadas",
      "meta": 1500,
      "unit": "personas",
      "progress": 0,
      "status": "PENDING",
      "poaPeriodId": "550e8400-e29b-41d4-a716-446655440030",
      "programId": "550e8400-e29b-41d4-a716-446655440010",
      "program": {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Renta Ciudadana"
      },
      "templateActivityId": "550e8400-e29b-41d4-a716-446655440020"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### 7. **Actualizar Actividad del POA**

**Endpoint:** `PATCH /agreement-activities/{ACTIVITY_ID}`

**Body:**
```json
{
  "progress": 75,
  "status": "IN_PROGRESS"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440050",
  "name": "Beneficiarios Renta Ciudadana",
  "description": "Número de personas beneficiadas",
  "meta": 1500,
  "unit": "personas",
  "progress": 75,
  "status": "IN_PROGRESS",
  "poaPeriodId": "550e8400-e29b-41d4-a716-446655440030",
  "programId": "550e8400-e29b-41d4-a716-446655440010"
}
```

---

## 🖥️ Pruebas Frontend

### 1. **Página de Plantillas**

**Ruta:** `/poa-templates`

**Tests:**
- ✅ Cargar lista de plantillas
- ✅ Buscar plantilla por nombre
- ✅ Crear nueva plantilla
- ✅ Agregar actividad a plantilla
- ✅ Ver actividades de plantilla (agrupadas por programa)
- ✅ Eliminar actividad de plantilla
- ✅ Desactivar plantilla

**Validaciones:**
- Campos requeridos
- Nombres únicos de plantillas
- Programa válido para actividades

---

### 2. **Detalle de Convenio**

**Ruta:** `/agreements/{ID}`

**Sección 1: Vigencias POA**
- ✅ Crear vigencia (año)
- ✅ Ver list de vigencias
- ✅ Asignar supervisor
- ✅ Ver estado de vigencia

**Sección 2: Aplicar Plantilla**
- ✅ Seleccionar vigencia
- ✅ Seleccionar plantilla
- ✅ Aplicar plantilla
- ✅ Validar que crea actividades

**Sección 3: Actividades del POA**
- ✅ Cambiar vigencia
- ✅ Ver actividades agrupadas por programa
- ✅ Editar progreso
- ✅ Cambiar estado
- ✅ Guardar cambios
- ✅ Refrescar datos

---

## 🔄 Flujo de Integración (End-to-End)

### Setup Inicial:
1. Crear 3 programas:
   - "Renta Ciudadana"
   - "Compensación IVA"
   - "Renta Joven"

2. Crear municipio (si no existe)

3. Crear convenio asociado al municipio

### Test Completo:

```bash
# 1. Crear plantilla
POST /poa-templates
{
  "name": "Plantilla E2E Test",
  "description": "Para test"
}
# → Copy TEMPLATE_ID

# 2. Agregar 3 actividades (una por programa)
POST /poa-templates/{TEMPLATE_ID}/activities
{
  "name": "Beneficiarios Renta",
  "meta": 1000,
  "unit": "personas",
  "programId": "{RENTA_CIUDADANA_ID}"
}

POST /poa-templates/{TEMPLATE_ID}/activities
{
  "name": "Trámites IVA",
  "meta": 500,
  "unit": "trámites",
  "programId": "{COMPENSACION_IVA_ID}"
}

POST /poa-templates/{TEMPLATE_ID}/activities
{
  "name": "Jóvenes Asistidos",
  "meta": 200,
  "unit": "personas",
  "programId": "{RENTA_JOVEN_ID}"
}

# 3. Crear POA Period (opcional, se crea al aplicar)
POST /poa-periods
{
  "year": 2025,
  "agreementId": "{AGREEMENT_ID}"
}

# 4. Aplicar plantilla
POST /agreements/{AGREEMENT_ID}/apply-template/{TEMPLATE_ID}

# 5. Obtener actividades
GET /agreement-activities?poaPeriodId={POA_PERIOD_ID}

# 6. Actualizar actividad
PATCH /agreement-activities/{ACTIVITY_ID}
{
  "progress": 50,
  "status": "IN_PROGRESS"
}

# 7. Verificar cambio
GET /agreement-activities?poaPeriodId={POA_PERIOD_ID}
```

---

## ✅ Checklist de Verificación

### Backend:
- [ ] Base de datos migrada (tablas creadas)
- [ ] Endpoints POST /poa-templates funciona
- [ ] Endpoint POST /poa-templates/:id/activities funciona
- [ ] Endpoint POST /agreements/:id/apply-template/:templateId funciona
- [ ] Validaciones de datos (campos requeridos)
- [ ] Validaciones de integridad (FK validos)
- [ ] Autenticación/Autorización funcionando
- [ ] Grouping por programa en queries

### Frontend:
- [ ] Página /poa-templates carga
- [ ] CRUD de plantillas funciona
- [ ] CRUD de actividades funciona
- [ ] Página /agreements/[id] carga
- [ ] Botón "Aplicar Plantilla" funciona
- [ ] Actividades se muestran agrupadas por programa
- [ ] Edición de progreso/estado funciona
- [ ] Mensajes de éxito/error se muestran

---

## 🐛 Errores Comunes

### 1. "Plantilla no encontrada"
- Verificar que el template ID es válido
- Verificar que la plantilla está activa

### 2. "La plantilla no tiene actividades"
- Agregar al menos una actividad a la plantilla
- Verificar que las actividades tienen un programa válido

### 3. "Ya existen actividades para este POA"
- La vigencia ya tiene actividades aplicadas
- Crear una nueva vigencia (año diferente)

### 4. Actividades no se muestran agrupadas
- Verificar que program relation está incluida en query
- Verificar que cada actividad tiene un programId válido

### 5. Frontend no se actualiza después de aplicar
- Verificar que `fetchActivities()` se llama
- Verificar que `selectedPoaForActivities` se actualiza
- Comprobar console para errores de API

---

## 📊 Datos de Prueba

### Programas (crear en la DB o via API):
```sql
INSERT INTO programs (id, name, description, active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Renta Ciudadana', 'Programa de renta ciudadana', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'Compensación IVA', 'Programa de compensación de IVA', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Renta Joven', 'Programa de renta para jóvenes', true, NOW(), NOW());
```

### Municipios (si necesarios):
```sql
INSERT INTO municipalities (id, code, name, department, active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440100', 'MUN001', 'Municipio Test', 'Departamento Test', true, NOW(), NOW());
```

### Convenios:
```sql
INSERT INTO agreements (id, agreement_number, start_date, end_date, status, municipality_id, description, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440200', 'CONV-001-2025', '2025-01-01', '2025-12-31', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440100', 'Convenio Test', NOW(), NOW());
```

---

## 🎬 Demo Script

```bash
# Setup
export API_URL="http://localhost:4000"
export JWT_TOKEN="your_jwt_token_here"

# Test 1: Crear plantilla
curl -X POST $API_URL/poa-templates \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plantilla Test",
    "description": "Para testing"
  }'
# → Copy ID como TEMPLATE_ID

# Test 2: Agregar actividad
curl -X POST $API_URL/poa-templates/{TEMPLATE_ID}/activities \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Activity",
    "meta": 100,
    "unit": "items",
    "programId": "{PROGRAM_ID}"
  }'

# ... resto de tests
```

**Sprint 3 Testing Complete! ✅**
