# Sprint 3 Summary — Plantillas POA + Aplicación de Actividades

## 📋 Objetivo Sprint
Implementar un sistema completo de plantillas POA que permita:
1. Crear plantillas con actividades predefinidas
2. Aplicar plantillas a convenios específicos
3. Visualizar actividades del POA en el frontend
4. Agrupar actividades por programa (como en el Excel original)

---

## ✅ Implementación Completada

### **Backend — Entidades**

#### 1. **PoaTemplate** (`backend/src/poa-templates/entities/poa-template.entity.ts`)
```typescript
- id: UUID (PK)
- name: string (ej: "Plantilla 2025")
- description: string (optional)
- active: boolean (default: true)
- createdBy: UUID (FK to User)
- activities: OneToMany PoaTemplateActivity[]
- createdAt: timestamp
- updatedAt: timestamp
```

#### 2. **PoaTemplateActivity** (`backend/src/poa-templates/entities/poa-template-activity.entity.ts`)
```typescript
- id: UUID (PK)
- name: string
- description: string (optional)
- meta: float (optional)
- unit: string (optional)
- templateId: UUID (FK to PoaTemplate)
- programId: UUID (FK to Program)
- program: ManyToOne Program
- createdAt: timestamp
- updatedAt: timestamp
```

#### 3. **AgreementActivity** (actualizado)
```typescript
- templateActivityId: string (optional - referencia a la actividad original)
- Relación con Program para agrupación
```

---

### **Backend — Endpoints**

#### 1. **POST /poa-templates**
Crear nueva plantilla POA
```json
Request:
{
  "name": "Plantilla 2025",
  "description": "Plantilla estándar para 2025",
  "createdBy": "user-id"
}

Response:
{
  "id": "template-uuid",
  "name": "Plantilla 2025",
  "description": "Plantilla estándar para 2025",
  "active": true,
  "activities": [],
  "createdAt": "2025-01-30T...",
  "updatedAt": "2025-01-30T..."
}
```

#### 2. **POST /poa-templates/:id/activities**
Agregar actividad a plantilla
```json
Request:
{
  "name": "Renta Ciudadana - Beneficiarios",
  "description": "Número de beneficiarios atendidos",
  "meta": 1000,
  "unit": "personas",
  "programId": "program-uuid"
}

Response:
{
  "id": "activity-uuid",
  "name": "Renta Ciudadana - Beneficiarios",
  "description": "Número de beneficiarios atendidos",
  "meta": 1000,
  "unit": "personas",
  "templateId": "template-uuid",
  "programId": "program-uuid",
  "createdAt": "2025-01-30T..."
}
```

#### 3. **POST /agreements/:id/apply-template/:templateId**
Aplicar plantilla a convenio (crea agreement_activities)
```
Query Params: ?year=2025 (opcional)

Response:
{
  "poaPeriod": {
    "id": "poa-period-uuid",
    "year": 2025,
    "status": "DRAFT",
    "agreementId": "agreement-uuid"
  },
  "activities": [
    {
      "id": "activity-uuid",
      "name": "Renta Ciudadana - Beneficiarios",
      "meta": 1000,
      "unit": "personas",
      "programId": "program-uuid",
      "poaPeriodId": "poa-period-uuid",
      "templateActivityId": "template-activity-uuid",
      "status": "PENDING",
      "progress": 0
    }
  ],
  "templateId": "template-uuid"
}
```

#### 4. **GET /poa-templates**
Listar plantillas con paginación

#### 5. **GET /poa-templates/:id**
Obtener plantilla con sus actividades

#### 6. **GET /poa-templates/:id/activities**
Listar actividades de una plantilla

#### 7. **PATCH /poa-templates/:id**
Actualizar plantilla

#### 8. **DELETE /poa-templates/:id**
Desactivar plantilla

#### 9. **DELETE /poa-templates/:templateId/activities/:activityId**
Eliminar actividad de plantilla

---

### **Backend — Servicios**

#### **PoaTemplatesService** (`poa-templates.service.ts`)
- `create(dto)` - Crear plantilla
- `findAll(filterDto)` - Listar con filtros
- `findById(id)` - Obtener una plantilla
- `update(id, dto)` - Actualizar
- `remove(id)` - Desactivar
- `addActivity(templateId, activityDto)` - Agregar actividad
- `getActivitiesByTemplate(templateId)` - Listar actividades
- `removeActivity(templateId, activityId)` - Eliminar actividad
- `getActiveTemplates()` - Plantillas activas

#### **AgreementsService (extendido)**
- `applyTemplate(agreementId, templateId, year?)` - Lógica principal:
  1. Valida que el convenio y plantilla existen
  2. Valida que la plantilla tiene actividades
  3. Obtiene o crea POA Period para el año
  4. Valida que no existan actividades previas
  5. Crea AgreementActivity copiadas desde la plantilla
  6. Retorna el POA Period con las actividades creadas

#### **AgreementActivitiesService (extendido)**
- `createFromTemplate(poaPeriodId, templateActivities)` - Copia actividades desde plantilla

---

### **Frontend — Componentes**

#### 1. **Página de Plantillas** (`src/app/poa-templates/page.tsx`)
- ✅ **Listado de plantillas** con búsqueda y paginación
- ✅ **Crear nueva plantilla** (modal/form)
- ✅ **Editar plantilla** (nombre, descripción)
- ✅ **Agregar actividades** a una plantilla
  - Seleccionar programa
  - Definir nombre, descripción, meta, unidad
- ✅ **Eliminar actividades** de plantilla
- ✅ **Ver actividades** de cada plantilla
- ✅ **Desactivar plantilla**

**Funcionalidades:**
```tsx
- fetchTemplates() - Cargar plantillas
- fetchActivities() - Cargar actividades de una plantilla
- fetchPrograms() - Cargar programas disponibles
- handleCreateTemplate() - Crear plantilla
- handleAddActivity() - Agregar actividad
- handleRemoveActivity() - Eliminar actividad
- handleEditTemplate() - Editar plantilla
```

#### 2. **Detalle de Convenio** (`src/app/agreements/[id]/page.tsx`)
##### Secciones de Vigencias POA:
- ✅ Crear vigencia POA (año)
- ✅ Asignar supervisor a vigencia
- ✅ Listar vigencias con estado

##### Sección "Aplicar Plantilla POA":
- ✅ **Selector de vigencia** (dropdown)
- ✅ **Selector de plantilla** (dropdown)
- ✅ **Botón "Aplicar Plantilla"**
  - Valida selecciones
  - Llama al endpoint POST /agreements/:id/apply-template/:templateId
  - Actualiza lista de actividades
  - Muestra mensaje de éxito/error

##### Sección "Actividades del POA":
- ✅ **Selector de vigencia** para cambiar entre años
- ✅ **Actividades agrupadas por Programa** (como en Excel)
  - Encabezado: Nombre del programa
  - Tabla con columnas:
    - Actividad (nombre + descripción)
    - Meta
    - Unidad
    - Avance (%) - editable
    - Estado - editable (PENDING, IN_PROGRESS, COMPLETED)
    - Botón Guardar (solo en modo edición)
- ✅ **Solo lectura** por defecto
- ✅ **Editable** para ADMIN, SUPERVISOR_POA, COORDINATOR

**Funcionalidades:**
```tsx
- fetchPoaPeriods() - Cargar vigencias
- fetchActivities(poaPeriodId) - Cargar actividades
- fetchTemplates() - Cargar plantillas disponibles
- fetchSupervisors() - Cargar supervisores
- handleApplyTemplate() - Aplicar plantilla (endpoint)
- handleActivityEdit() - Editar progreso/estado
- handleSaveActivity() - Guardar cambios de actividad
- groupedActivities - Agrupar por programa
```

---

## 📊 Relaciones de Datos

```
Program (maestro)
├── name: "Renta Ciudadana"
├── description: "..."
└── Relaciones:
    ├── poaTemplateActivities: PoaTemplateActivity[]
    └── agreementActivities: AgreementActivity[]

PoaTemplate (plantilla)
├── name: "Plantilla 2025"
├── description: "..."
├── active: true
└── activities: PoaTemplateActivity[]
    ├── name, meta, unit
    ├── programId (FK)
    └── poaTemplateId (FK)

Agreement (convenio)
├── agreementNumber, dates, status
└── poaPeriods: PoaPeriod[]
    ├── year, status
    └── activities: AgreementActivity[]
        ├── name, meta, unit
        ├── progress, status
        ├── programId (FK)
        ├── poaPeriodId (FK)
        └── templateActivityId (referencia a origen)
```

---

## 🎯 Demo del Sprint 3

### Flujo Completo:

1. **Crear Plantilla**
   - Ir a: Menú → Plantillas POA
   - Click: "+ Crear Plantilla"
   - Ingresar:
     - Nombre: "Plantilla Enero 2025"
     - Descripción: "Plantilla estándar"
   - Click: Crear

2. **Agregar Actividades a Plantilla**
   - En plantilla creada, click: "Agregar Actividad"
   - Ingresar (primera actividad):
     - Programa: "Renta Ciudadana"
     - Nombre: "Beneficiarios atendidos"
     - Meta: 1000
     - Unidad: "personas"
   - Click: Agregar
   - Repetir con:
     - Programa: "Compensación IVA", Nombre: "Solicitudes procesadas", Meta: 500, Unit: "trámites"
     - Programa: "Renta Joven", Nombre: "Jóvenes asistidos", Meta: 200, Unit: "personas"

3. **Aplicar Plantilla a Convenio**
   - Ir a: Convenios → Seleccionar convenio
   - Sección: "Aplicar Plantilla POA"
   - Seleccionar:
     - Vigencia: "POA 2025"
     - Plantilla: "Plantilla Enero 2025"
   - Click: "Aplicar Plantilla"
   - Resultado: Se crean 3 AgreementActivity copiadas

4. **Ver Actividades en POA**
   - En mismo convenio, bajar a: "Actividades del POA"
   - Selector: "POA 2025"
   - Resultado: **Actividades agrupadas por programa**
     ```
     ╔═══════════════════════════════════════╗
     ║ Renta Ciudadana                       ║
     ├───────────────────────────────────────┤
     │ Actividad: Beneficiarios atendidos    │
     │ Meta: 1000 personas | Avance: 0%      │
     │ Estado: PENDING                       │
     └───────────────────────────────────────┘
     
     ╔═══════════════════════════════════════╗
     ║ Compensación IVA                      ║
     ├───────────────────────────────────────┤
     │ Actividad: Solicitudes procesadas     │
     │ Meta: 500 trámites | Avance: 0%       │
     │ Estado: PENDING                       │
     └───────────────────────────────────────┘
     
     ╔═══════════════════════════════════════╗
     ║ Renta Joven                           ║
     ├───────────────────────────────────────┤
     │ Actividad: Jóvenes asistidos          │
     │ Meta: 200 personas | Avance: 0%       │
     │ Estado: PENDING                       │
     └───────────────────────────────────────┘
     ```

5. **Editar Actividades (Supervisor)**
   - Cambiar: Avance de "Beneficiarios atendidos" a 500%
   - Cambiar: Estado a "IN_PROGRESS"
   - Click: Guardar
   - Resultado: Actividad actualizada

---

## 🔐 Control de Acceso

### Permisos por Endpoint:

| Endpoint | GET | POST | PATCH | DELETE |
|----------|-----|------|-------|--------|
| `/poa-templates` | Public | ADMIN, SUPERVISOR_POA | ADMIN, SUPERVISOR_POA | ADMIN |
| `/poa-templates/:id` | Public | - | - | - |
| `/poa-templates/:id/activities` | Public | ADMIN, SUPERVISOR_POA | - | ADMIN, SUPERVISOR_POA |
| `/agreements/:id/apply-template/:templateId` | - | ADMIN, COORDINATOR, SUPERVISOR_POA | - | - |

### Permisos en Frontend:

- **Ver Plantillas**: Todos autenticados
- **Crear/Editar Plantillas**: ADMIN, SUPERVISOR_POA
- **Ver Detalles Convenio**: Todos autenticados
- **Crear Vigencia POA**: ADMIN, COORDINATOR
- **Asignar Supervisor**: ADMIN, COORDINATOR
- **Aplicar Plantilla**: ADMIN, COORDINATOR, SUPERVISOR_POA
- **Editar Actividades**: ADMIN, SUPERVISOR_POA, COORDINATOR

---

## 📁 Archivos Modificados

### Backend:
- ✅ `backend/src/poa-templates/entities/poa-template.entity.ts` (exists)
- ✅ `backend/src/poa-templates/entities/poa-template-activity.entity.ts` (exists)
- ✅ `backend/src/poa-templates/poa-templates.service.ts` (complete)
- ✅ `backend/src/poa-templates/poa-templates.controller.ts` (complete)
- ✅ `backend/src/poa-templates/poa-templates.module.ts` (configured)
- ✅ `backend/src/agreements/agreements.service.ts` (applyTemplate method)
- ✅ `backend/src/agreements/agreements.controller.ts` (apply-template endpoint)
- ✅ `backend/src/agreement-activities/agreement-activities.service.ts` (createFromTemplate)
- ✅ `backend/src/programs/entities/program.entity.ts` (relations updated)

### Frontend:
- ✅ `frontend/src/app/poa-templates/page.tsx` (complete)
- ✅ `frontend/src/app/agreements/[id]/page.tsx` (updated)
- ✅ `frontend/src/lib/api.ts` (no changes needed)

---

## 🧪 Pruebas Sugeridas

1. **Crear Plantilla**
   - ✅ POST /poa-templates → debe retornar ID
   - ✅ Validar campos requeridos

2. **Agregar Actividades**
   - ✅ POST /poa-templates/:id/activities → debe validar programId
   - ✅ GET /poa-templates/:id/activities → debe retornar actividades

3. **Aplicar Plantilla**
   - ✅ POST /agreements/:id/apply-template/:templateId → debe crear AgreementActivity
   - ✅ Validar que no se aplique si ya hay actividades
   - ✅ Validar que cree POA Period si no existe

4. **Ver Actividades en Frontend**
   - ✅ Actividades agrupadas por programa
   - ✅ Edición de progreso y estado
   - ✅ Persistencia de cambios

---

## 🚀 Próximos Pasos (Sprint 4)

1. **Auditoría de Cambios**: Registrar quién modificó qué actividades
2. **Historial de Plantillas**: Ver versiones anteriores
3. **Exportación a Excel**: Descargar POA completo
4. **Validaciones Avanzadas**: Min/max de metas, alertas de desviación
5. **Comentarios en Actividades**: Registro de observaciones

---

## ✨ Resultado Visual

El POA ahora se ve **exactamente como en el Excel original**:
- Actividades **organizadas por programa**
- **Metas claras** con unidades
- **Seguimiento de progreso** (%)
- **Estado de cada actividad** (PENDING, IN_PROGRESS, COMPLETED)
- **Trazabilidad** desde plantilla → convenio → período → actividad

**Sprint 3 = 100% Complete ✅**
