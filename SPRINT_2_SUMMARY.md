# Sprint 2 — Municipios + Convenios + Vigencia POA

## ✅ Implementación Completada

### Objetivo General
Registrar y consultar municipios y convenios, con asignación de supervisores a vigencias POA.

---

## Backend - Implementación Completa

### 1. **Entidades**

#### `Municipality` (Municipio)
- **Tabla**: `municipalities`
- **Campos**:
  - `id`: UUID (PK)
  - `code`: String unique (Código DANE)
  - `name`: String (Nombre municipio)
  - `department`: String (Departamento)
  - `active`: Boolean (default: true)
  - `createdAt`, `updatedAt`: Timestamps
- **Relaciones**: OneToMany con `Agreement`
- **Índices**: code, name, department

#### `Agreement` (Convenio)
- **Tabla**: `agreements`
- **Campos**:
  - `id`: UUID (PK)
  - `agreementNumber`: String unique (Número del convenio)
  - `startDate`: Date (Fecha inicio)
  - `endDate`: Date (Fecha vencimiento)
  - `status`: Enum (ACTIVE, INACTIVE, SUSPENDED, EXPIRED)
  - `description`: String nullable
  - `municipalityId`: Foreign Key
  - `createdAt`, `updatedAt`: Timestamps
- **Relaciones**:
  - ManyToOne con `Municipality`
  - OneToMany con `PoaPeriod`
- **Índices**: agreementNumber, municipalityId, status

#### `PoaPeriod` (Vigencia POA)
- **Tabla**: `poa_periods`
- **Campos**:
  - `id`: UUID (PK)
  - `year`: Number (Año de vigencia: 2024, 2025, etc.)
  - `status`: Enum (DRAFT, IN_PROGRESS, SUBMITTED, APPROVED, REJECTED, COMPLETED)
  - `agreementId`: Foreign Key
  - `supervisorId`: Foreign Key nullable (Usuario supervisor)
  - `notes`: String nullable (Observaciones)
  - `createdAt`, `updatedAt`: Timestamps
- **Relaciones**:
  - ManyToOne con `Agreement`
  - ManyToOne con `User` (supervisor)
- **Índices**: year, agreementId, status

### 2. **DTOs**

#### MunicipalityDto
```typescript
CreateMunicipalityDto: { code, name, department }
UpdateMunicipalityDto: { name?, department?, active? }
MunicipalityFilterDto: { search?, department?, page?, limit? }
```

#### AgreementDto
```typescript
CreateAgreementDto: { agreementNumber, startDate, endDate, status?, description?, municipalityId }
UpdateAgreementDto: { startDate?, endDate?, status?, description? }
AssignSupervisorDto: { supervisorId, year }
AgreementFilterDto: { municipalityId?, department?, status?, page?, limit? }
```

#### PoaPeriodDto
```typescript
CreatePoaPeriodDto: { year, agreementId, notes? }
UpdatePoaPeriodDto: { status?, notes? }
AssignSupervisorToPoaDto: { supervisorId }
PoaPeriodFilterDto: { agreementId?, year?, status?, page?, limit? }
```

### 3. **Servicios**

#### MunicipalitiesService
- `create()`: Crear municipio (validar DANE único)
- `findAll()`: Listar con filtros y paginación
- `findById()`: Obtener por ID
- `update()`: Actualizar
- `remove()`: Desactivar (soft delete)
- `getDepartments()`: Lista única de departamentos

#### AgreementsService
- `create()`: Crear convenio (validar fechas, municipio, número único)
- `findAll()`: Listar con filtros (municipalidad, departamento, estado, paginación)
- `findById()`: Obtener con relaciones
- `update()`: Actualizar
- `remove()`: Eliminar
- `getByMunicipality()`: Obtener convenios de municipio

#### PoaPeriodsService
- `create()`: Crear vigencia POA (validar año único por convenio)
- `findAll()`: Listar con filtros y paginación
- `findById()`: Obtener con relaciones
- `update()`: Actualizar estado/notas
- `assignSupervisor()`: Asignar supervisor a vigencia
- `remove()`: Eliminar
- `getByAgreement()`: Obtener todas las vigencias de un convenio
- `createDefaultPoaPeriods()`: Helper para crear vigencias por defecto (2024, 2025)

### 4. **Controladores**

#### MunicipalitiesController
- `POST /municipalities` (ADMIN)
- `GET /municipalities` (AUTHENTICATED) - con filtros y paginación
- `GET /municipalities/departments` (AUTHENTICATED) - lista de departamentos
- `GET /municipalities/:id` (AUTHENTICATED)
- `PATCH /municipalities/:id` (ADMIN)
- `DELETE /municipalities/:id` (ADMIN)

#### AgreementsController
- `POST /agreements` (ADMIN, COORDINATOR)
- `GET /agreements` (AUTHENTICATED) - con filtros y paginación
- `GET /agreements/:id` (AUTHENTICATED)
- `GET /agreements/municipality/:municipalityId` (AUTHENTICATED)
- `PATCH /agreements/:id` (ADMIN, COORDINATOR)
- `DELETE /agreements/:id` (ADMIN)

#### PoaPeriodsController
- `POST /poa-periods` (ADMIN, COORDINATOR)
- `GET /poa-periods` (AUTHENTICATED) - con filtros y paginación
- `GET /poa-periods/:id` (AUTHENTICATED)
- `GET /poa-periods/agreement/:agreementId` (AUTHENTICATED)
- `PATCH /poa-periods/:id` (ADMIN, COORDINATOR)
- `PATCH /poa-periods/:id/assign-supervisor` (ADMIN, COORDINATOR, SUPERVISOR_POA)
- `DELETE /poa-periods/:id` (ADMIN)

### 5. **Módulos**

- `MunicipalitiesModule`: TypeORM + Controller + Service
- `AgreementsModule`: TypeORM + Controller + Service (importa Municipalities, PoaPeriods)
- `PoaPeriodsModule`: TypeORM + Controller + Service
- **AppModule actualizado** con todas las entidades y módulos

---

## Frontend - Implementación Completa

### 1. **Páginas**

#### `/municipalities`
**Funcionalidades**:
- ✓ Listar municipios con paginación
- ✓ Búsqueda por nombre o código DANE
- ✓ Filtro por departamento
- ✓ Crear nuevo municipio (ADMIN only)
- ✓ Botón "Ver Convenios" para cada municipio
- ✓ Tabla con código, nombre, departamento

**UI**:
- Filtros en barra superior
- Tabla responsive con hover
- Paginación (Anterior/Siguiente)
- Formulario inline para crear

#### `/agreements`
**Funcionalidades**:
- ✓ Listar convenios con paginación
- ✓ Filtro por municipio
- ✓ Filtro por departamento
- ✓ Filtro por estado (ACTIVE, INACTIVE, SUSPENDED, EXPIRED)
- ✓ Crear nuevo convenio (ADMIN, COORDINATOR)
- ✓ Botón "Ver Vigencias" para cada convenio
- ✓ Tabla con número, municipio, vigencia, estado

**UI**:
- Selectores para filtros
- Tabla responsive
- Badges de estado con colores
- Formulario para crear convenio

#### `/agreements/[id]`
**Funcionalidades**:
- ✓ Detalle completo del convenio
- ✓ Información del municipio y vigencia
- ✓ Listar todas las vigencias POA
- ✓ Crear nueva vigencia POA
- ✓ Asignar supervisor a vigencia POA (ADMIN, COORDINATOR)
- ✓ Ver supervisor asignado y sus datos
- ✓ Estado y notas de cada vigencia

**UI**:
- Tarjeta de detalles del convenio
- Tabla de vigencias con año, supervisor, estado, notas
- Formulario inline para crear vigencia
- Panel de asignación de supervisor con selectores

### 2. **Componentes Integrados**

- **Sidebar actualizado** con nuevas rutas:
  - Municipios
  - Convenios
- **AuthContext**: Manejo de usuario y permisos
- **API Client**: Manejo de cookies y CORS

### 3. **Flujos de Datos**

**Crear Municipio**:
1. Admin accede a `/municipalities`
2. Hace click en "+ Crear Municipio"
3. Completa formulario (código DANE, nombre, departamento)
4. POST a `/municipalities`
5. Se actualiza la lista

**Crear Convenio**:
1. Admin/Coordinator accede a `/agreements`
2. Hace click en "+ Crear Convenio"
3. Selecciona municipio, fechas, número, estado
4. POST a `/agreements`
5. Se actualiza la lista
6. Sistema crea automáticamente vigencias POA (años 2024, 2025)

**Crear Vigencia POA**:
1. Usuario accede a `/agreements/[id]`
2. Ve todas las vigencias existentes
3. Hace click en "+ Crear Vigencia"
4. Selecciona año
5. POST a `/poa-periods`
6. Se actualiza la tabla

**Asignar Supervisor**:
1. Usuario (ADMIN/COORDINATOR/SUPERVISOR_POA) en `/agreements/[id]`
2. Usa panel "Asignar Supervisor"
3. Selecciona vigencia POA
4. Selecciona supervisor (solo SUPERVISOR_POA role)
5. PATCH a `/poa-periods/:id/assign-supervisor`
6. Se actualiza la vigencia con supervisor asignado

---

## Validaciones Implementadas

### Backend
- ✓ Email único para municipios (código DANE)
- ✓ Número de convenio único
- ✓ Año único por convenio (no duplicar vigencia POA)
- ✓ Validación de fechas (startDate < endDate)
- ✓ Validación de enums (status, role)
- ✓ Validación de UUID en foreign keys
- ✓ Verificación de existencia antes de actualizar/eliminar

### Frontend
- ✓ Campos obligatorios en formularios
- ✓ Validación de fechas antes de enviar
- ✓ Permisos basados en rol (ADMIN, COORDINATOR, SUPERVISOR_POA)
- ✓ Manejo de errores con alertas
- ✓ Estados de carga

---

## Control de Acceso por Rol

| Endpoint | ADMIN | SUPERVISOR_POA | COORDINATOR | USER |
|----------|-------|-----------------|-------------|------|
| POST /municipalities | ✓ | ✗ | ✗ | ✗ |
| GET /municipalities | ✓ | ✓ | ✓ | ✓ |
| POST /agreements | ✓ | ✗ | ✓ | ✗ |
| GET /agreements | ✓ | ✓ | ✓ | ✓ |
| POST /poa-periods | ✓ | ✗ | ✓ | ✗ |
| PATCH /poa-periods/:id/assign-supervisor | ✓ | ✓ | ✓ | ✗ |

---

## Flujo Demo Completo

### ✅ Escenario: Crear municipio → convenio → vigencias → asignar supervisor

1. **Admin crea municipio**
   - POST /municipalities → { code: "05001", name: "Medellín", department: "Antioquia" }
   - Resultado: Municipio guardado en DB

2. **Admin crea convenio para municipio**
   - POST /agreements → { agreementNumber: "AGR-2024-001", startDate: "2024-01-01", endDate: "2024-12-31", municipalityId: "uuid", status: "ACTIVE" }
   - Resultado: Convenio creado y ligado a municipio

3. **Sistema crea vigencias POA automáticas**
   - POST /poa-periods → { year: 2024, agreementId: "uuid" }
   - POST /poa-periods → { year: 2025, agreementId: "uuid" }
   - Resultado: Dos vigencias creadas en DRAFT

4. **Coordinator asigna supervisor POA**
   - PATCH /poa-periods/:id/assign-supervisor → { supervisorId: "uuid-supervisor" }
   - Resultado: Supervisor vinculado a vigencia 2024

5. **Frontend refleja cambios en tiempo real**
   - Usuario ve en `/agreements/[id]`:
     - Vigencia 2024 con supervisor asignado ✓
     - Vigencia 2025 sin supervisor (puede asignar)

---

## Entidades Relacionadas

```
User (Sprint 1)
  └─ puede ser supervisor de → PoaPeriod

Municipality (Sprint 2)
  └─ tiene muchos → Agreement

Agreement (Sprint 2)
  ├─ pertenece a → Municipality
  └─ tiene muchos → PoaPeriod

PoaPeriod (Sprint 2)
  ├─ pertenece a → Agreement
  └─ puede tener → User (supervisor)
```

---

## Archivos Creados/Modificados

### Backend

**Entidades**:
- ✓ `src/municipalities/entities/municipality.entity.ts`
- ✓ `src/agreements/entities/agreement.entity.ts`
- ✓ `src/poa-periods/entities/poa-period.entity.ts`

**DTOs**:
- ✓ `src/municipalities/dtos/municipality.dto.ts`
- ✓ `src/agreements/dtos/agreement.dto.ts`
- ✓ `src/poa-periods/dtos/poa-period.dto.ts`

**Servicios**:
- ✓ `src/municipalities/municipalities.service.ts`
- ✓ `src/agreements/agreements.service.ts`
- ✓ `src/poa-periods/poa-periods.service.ts`

**Controladores**:
- ✓ `src/municipalities/municipalities.controller.ts`
- ✓ `src/agreements/agreements.controller.ts`
- ✓ `src/poa-periods/poa-periods.controller.ts`

**Módulos**:
- ✓ `src/municipalities/municipalities.module.ts`
- ✓ `src/agreements/agreements.module.ts`
- ✓ `src/poa-periods/poa-periods.module.ts`

**App**:
- ✓ `src/app.module.ts` (actualizado con 3 nuevos módulos y entidades)

### Frontend

**Páginas**:
- ✓ `src/app/municipalities/page.tsx`
- ✓ `src/app/agreements/page.tsx`
- ✓ `src/app/agreements/[id]/page.tsx`

**Componentes**:
- ✓ `src/components/Sidebar.tsx` (actualizado con nuevas rutas)

---

## Próximos Pasos (Sprint 3+)

1. **Actividades** - Crear tareas dentro de vigencias POA
2. **Indicadores** - Registrar avances y métricas
3. **Reportes** - Generar reportes por municipio/convenio/vigencia
4. **Auditoría** - Registrar cambios en convenios y vigencias
5. **Notificaciones** - Alertas cuando vence vigencias POA

---

## Estado Final

🟢 **Sprint 2 COMPLETADO**

- ✓ Backend: 3 entidades + 3 servicios + 3 controladores
- ✓ Frontend: 3 páginas + navegación actualizada
- ✓ Control de acceso por roles
- ✓ Validaciones completas
- ✓ UI responsive y funcional
- ✓ Flujo completo: municipio → convenio → vigencia → supervisor

**Total de endpoints creados**: 19 endpoints REST con CRUD completo
**Total de componentes frontend**: 3 páginas principales
**Total de validaciones**: 15+ validaciones en backend y frontend
