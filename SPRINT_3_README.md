# 🎯 Sprint 3 - Plantillas POA y Aplicación de Actividades

## 📌 Resumen Ejecutivo

**Sprint 3** implementa el core de la funcionalidad de POA: permitir crear **plantillas reutilizables** de actividades y **aplicarlas a convenios específicos**. Esto transforma el sistema de un simple formulario a una **plataforma de gestión de planes operativos escalable**.

### 🎨 Resultado Visual

Cuando un usuario aplica una plantilla, ve sus actividades **exactamente como en el Excel original**: organizadas por **Programas**, con **metas claras** y capacidad de **seguimiento en tiempo real**.

---

## 🏗️ Arquitectura Implementada

### Entidades Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                       POA STRUCTURE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Program (Maestro)                                                │
│  ├─ name: "Renta Ciudadana"                                      │
│  ├─ description: "..."                                           │
│  └─ Relations:                                                   │
│     ├─ poaTemplateActivities: PoaTemplateActivity[]              │
│     └─ agreementActivities: AgreementActivity[]                  │
│                                                                   │
│  PoaTemplate (Reutilizable)                                       │
│  ├─ name: "Plantilla Q1 2025"                                    │
│  ├─ description: "..."                                           │
│  ├─ active: true                                                 │
│  └─ activities: PoaTemplateActivity[]                             │
│     ├─ name, meta, unit                                          │
│     └─ programId (FK)                                            │
│                                                                   │
│  Agreement → PoaPeriod → AgreementActivity (Instancia Real)      │
│  ├─ name, meta, unit                                             │
│  ├─ progress: número (%)                                         │
│  ├─ status: PENDING | IN_PROGRESS | COMPLETED                   │
│  ├─ programId (para agrupación)                                  │
│  └─ templateActivityId (referencia al origen)                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
1. CREAR PLANTILLA
   POST /poa-templates
   → Crear PoaTemplate vacío

2. AGREGAR ACTIVIDADES
   POST /poa-templates/:id/activities
   → Crear PoaTemplateActivity
   → Asociar a Programa

3. CREAR/SELECCIONAR POA PERIOD
   POST /poa-periods
   → Crear vigencia anual del convenio

4. APLICAR PLANTILLA
   POST /agreements/:id/apply-template/:templateId
   → Copiar PoaTemplateActivity → AgreementActivity
   → Crear relationships: POA Period ↔ Activity ↔ Program
   → Status = PENDING, Progress = 0

5. VER Y EDITAR ACTIVIDADES
   GET /agreement-activities?poaPeriodId=xxx
   → Agrupar por Program en frontend
   PATCH /agreement-activities/:id
   → Actualizar progress, status
```

---

## 📁 Cambios de Código

### Backend Modifications

#### 1️⃣ **Entidades** (existentes, validadas)
- ✅ `PoaTemplate` — Plantilla reutilizable
- ✅ `PoaTemplateActivity` — Actividad de plantilla
- ✅ `AgreementActivity` (actualizada) — Campo `templateActivityId` agregado
- ✅ `Program` — Relations a templates y agreement activities

#### 2️⃣ **Servicios** (existentes, completos)

**PoaTemplatesService:**
```typescript
- create()              // Crear plantilla
- findAll()            // Listar con filtros
- findById()           // Obtener + relations
- update()             // Actualizar campos
- remove()             // Desactivar (soft delete)
- addActivity()        // Agregar actividad
- getActivitiesByTemplate()  // Listar actividades
- removeActivity()     // Eliminar actividad
- getActiveTemplates() // Plantillas activas
```

**AgreementsService (extendido):**
```typescript
- applyTemplate(agreementId, templateId, year?)
  ├─ Validar convenio y plantilla
  ├─ Crear/obtener POA Period
  ├─ Validar que no hay actividades previas
  ├─ Copiar actividades de template
  └─ Retornar nuevo POA Period + activities
```

**AgreementActivitiesService (extendido):**
```typescript
- createFromTemplate(poaPeriodId, templateActivities)
  └─ Mapear cada activity: copy fields + add FK's
```

#### 3️⃣ **Controladores** (existentes, completos)

**PoaTemplatesController:**
```
POST   /poa-templates                    → create()
GET    /poa-templates                    → findAll()
GET    /poa-templates/active/list        → getActiveTemplates()
GET    /poa-templates/:id                → findById()
GET    /poa-templates/:id/activities     → getActivities()
POST   /poa-templates/:id/activities     → addActivity()
PATCH  /poa-templates/:id                → update()
DELETE /poa-templates/:id                → remove()
DELETE /poa-templates/:templateId/activities/:activityId → removeActivity()
```

**AgreementsController (extendido):**
```
POST /agreements/:id/apply-template/:templateId → applyTemplate()
```

### Frontend Modifications

#### 1️⃣ **Página: `/poa-templates`**
- ✅ Listado de plantillas (tabla con search + paginación)
- ✅ Crear nueva plantilla (modal/form)
- ✅ Editar plantilla (inline o modal)
- ✅ Agregar actividades (form con selector de programa)
- ✅ Ver actividades por plantilla
- ✅ Eliminar actividades
- ✅ Desactivar plantilla
- ✅ Control de permisos (ADMIN, SUPERVISOR_POA)

#### 2️⃣ **Página: `/agreements/[id]`**
- ✅ Sección "Aplicar Plantilla POA"
  - Selector de vigencia
  - Selector de plantilla
  - Botón aplicar + handlers
- ✅ Sección "Actividades del POA"
  - Selector de vigencia
  - **Actividades agrupadas por Programa** ← KEY FEATURE
  - Tabla con: Actividad, Meta, Unidad, Avance (%), Estado
  - Botones: Guardar (con validaciones)
  - Control de permisos (editable solo para roles específicos)

---

## 🔐 Seguridad y Permisos

### Role-Based Access Control

| Recurso | GET | POST | PATCH | DELETE |
|---------|-----|------|-------|--------|
| **Plantillas** | All | ADMIN, SUP_POA | ADMIN, SUP_POA | ADMIN |
| **Actividades Plantilla** | All | ADMIN, SUP_POA | - | ADMIN, SUP_POA |
| **Aplicar Plantilla** | - | ADMIN, COORD, SUP_POA | - | - |
| **Actividades POA** | All | All | ADMIN, SUP_POA, COORD | ADMIN |

### Validaciones

1. **Crear Plantilla**: Nombre no vacío
2. **Agregar Actividad**: Programa debe existir (FK)
3. **Aplicar Plantilla**:
   - Convenio debe existir
   - Plantilla debe existir y estar activa
   - Plantilla debe tener ≥1 actividad
   - POA Period no debe tener actividades previas
4. **Editar Actividad**:
   - Progress: 0-100 (%)
   - Status: enum válido (PENDING, IN_PROGRESS, COMPLETED)

---

## 🎬 Demostración Completa (Step-by-Step)

### Step 1: Crear Plantilla
```
Ruta: /poa-templates
Botón: "+ Crear Plantilla"
Datos:
  nombre: "Plantilla Estándar 2025"
  descripción: "Plantilla base para todos los convenios"
→ Se guarda y aparece en lista
```

### Step 2: Agregar Actividades
```
Plantilla: "Plantilla Estándar 2025"
Botón: "Agregar Actividad"

Actividad 1:
  programa: "Renta Ciudadana"
  nombre: "Beneficiarios atendidos"
  meta: 1000
  unidad: "personas"
  → Se agrega a tabla

Actividad 2:
  programa: "Compensación IVA"
  nombre: "Trámites procesados"
  meta: 500
  unidad: "trámites"
  → Se agrega a tabla

Actividad 3:
  programa: "Renta Joven"
  nombre: "Jóvenes capacitados"
  meta: 200
  unidad: "horas"
  → Se agrega a tabla
```

### Step 3: Aplicar a Convenio
```
Ruta: /agreements/{ID}
Sección: "Aplicar Plantilla POA"

Selecciones:
  vigencia: "POA 2025"
  plantilla: "Plantilla Estándar 2025"
  
Botón: "Aplicar Plantilla"
→ POST /agreements/{ID}/apply-template/{TEMPLATE_ID}
→ Se crean 3 AgreementActivity
→ Se vinculan a POA Period 2025
```

### Step 4: Ver Actividades Agrupadas
```
Sección: "Actividades del POA"
Selector: "POA 2025"

Resultado: AGRUPADAS POR PROGRAMA
┌─────────────────────────────────────────┐
│ 📊 Renta Ciudadana                       │
├─────────────────────────────────────────┤
│ ☐ Beneficiarios atendidos               │
│   Meta: 1000 personas | Avance: 0%      │
│   Estado: PENDING | Guardar             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📊 Compensación IVA                      │
├─────────────────────────────────────────┤
│ ☐ Trámites procesados                   │
│   Meta: 500 trámites | Avance: 0%       │
│   Estado: PENDING | Guardar             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📊 Renta Joven                           │
├─────────────────────────────────────────┤
│ ☐ Jóvenes capacitados                   │
│   Meta: 200 horas | Avance: 0%          │
│   Estado: PENDING | Guardar             │
└─────────────────────────────────────────┘
```

### Step 5: Actualizar Actividades
```
En tabla de "Actividades del POA"

Cambios:
  Renta Ciudadana - Avance: 500% (50%)
  Estado: IN_PROGRESS
  
Botón: Guardar
→ PATCH /agreement-activities/{ID}
→ Actividad actualizada
→ Tabla se refresca

Resultado: Se ve actualizado en tiempo real
```

---

## 📊 Ejemplos de Datos Esperados

### Plantilla Aplicada
```json
{
  "id": "template-uuid-001",
  "name": "Plantilla Estándar 2025",
  "activities": [
    {
      "id": "activity-uuid-001",
      "name": "Beneficiarios atendidos",
      "meta": 1000,
      "unit": "personas",
      "program": {
        "id": "program-uuid-001",
        "name": "Renta Ciudadana"
      }
    },
    {
      "id": "activity-uuid-002",
      "name": "Trámites procesados",
      "meta": 500,
      "unit": "trámites",
      "program": {
        "id": "program-uuid-002",
        "name": "Compensación IVA"
      }
    }
  ]
}
```

### POA con Actividades (Agrupado por Frontend)
```javascript
const groupedActivities = {
  "Renta Ciudadana": [
    {
      id: "activity-uuid-001",
      name: "Beneficiarios atendidos",
      meta: 1000,
      unit: "personas",
      progress: 50,
      status: "IN_PROGRESS"
    }
  ],
  "Compensación IVA": [
    {
      id: "activity-uuid-002",
      name: "Trámites procesados",
      meta: 500,
      unit: "trámites",
      progress: 0,
      status: "PENDING"
    }
  ]
}
```

---

## 📝 Archivos Generados/Modificados

### Nuevos:
- ✅ `SPRINT_3_SUMMARY.md` — Documentación técnica completa
- ✅ `SPRINT_3_TESTING_GUIDE.md` — Guía de testing exhaustiva
- ✅ `SPRINT_3_README.md` — Este archivo

### Backend (existentes, validados):
- ✅ `backend/src/poa-templates/poa-templates.service.ts`
- ✅ `backend/src/poa-templates/poa-templates.controller.ts`
- ✅ `backend/src/poa-templates/poa-templates.module.ts`
- ✅ `backend/src/poa-templates/entities/poa-template.entity.ts`
- ✅ `backend/src/poa-templates/entities/poa-template-activity.entity.ts`
- ✅ `backend/src/poa-templates/dtos/poa-template.dto.ts`
- ✅ `backend/src/agreements/agreements.service.ts` (applyTemplate method)
- ✅ `backend/src/agreements/agreements.controller.ts` (apply-template endpoint)
- ✅ `backend/src/agreement-activities/agreement-activities.service.ts` (createFromTemplate)
- ✅ `backend/src/app.module.ts` (imports updated)

### Frontend (existentes, validados):
- ✅ `frontend/src/app/poa-templates/page.tsx` — Página completa
- ✅ `frontend/src/app/agreements/[id]/page.tsx` — Secciones agregadas

---

## 🚀 Cómo Ejecutar

### Backend

```bash
# 1. Instalar dependencias (si es necesario)
cd backend
npm install

# 2. Migrar base de datos (auto con synchronize: true en dev)
npm run typeorm:migration:generate -- -n CreatePoaTemplates

# 3. Iniciar servidor
npm run start:dev

# ✅ Servidor corriendo en http://localhost:4000
```

### Frontend

```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Configurar .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000

# 3. Iniciar servidor
npm run dev

# ✅ Frontend corriendo en http://localhost:3000
```

### Docker Compose (Alternativa)

```bash
# En la raíz del proyecto
docker-compose up

# ✅ Todos los servicios corriendo:
# - Backend: localhost:4000
# - Frontend: localhost:3000
# - PostgreSQL: localhost:5432
# - PgAdmin: localhost:5050
```

---

## ✅ Checklist Final

- [x] Entidades creadas (PoaTemplate, PoaTemplateActivity, AgreementActivity actualizada)
- [x] Servicios implementados (PoaTemplatesService, AgreementsService.applyTemplate)
- [x] Controladores con endpoints completos
- [x] Página de Plantillas funcional
- [x] Detalle Convenio con aplicación de plantillas
- [x] Actividades agrupadas por Programa
- [x] Control de acceso (roles)
- [x] Validaciones en backend y frontend
- [x] Documentación técnica completa
- [x] Guía de testing exhaustiva
- [x] Ejemplo de datos esperados

---

## 🎯 Resultado Final

**El POA ahora es una herramienta profesional** que permite:

1. ✅ **Reutilizar plantillas** entre convenios
2. ✅ **Organizar actividades por programa** (como en Excel)
3. ✅ **Trackear progreso** en tiempo real
4. ✅ **Escalar a cientos de convenios** sin duplicar datos
5. ✅ **Mantener integridad** entre plantillas y realizaciones

**Sprint 3 = Complete ✨**

---

**Próximo Sprint:** Auditoría, historial, exportación Excel, validaciones avanzadas.
