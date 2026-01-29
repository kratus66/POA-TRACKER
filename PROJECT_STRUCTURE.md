# 📁 Estructura del Proyecto - Sprint 2

## Árbol de Archivos Completo

```
POA TRACKER/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── decorators/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── current-user.decorator.ts
│   │   │   └── dto/
│   │   │       └── index.ts (RegisterDto, LoginDto)
│   │   │
│   │   ├── users/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts (UserRole, UserStatus enums)
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── admin.controller.ts (admin endpoints)
│   │   │   └── dtos/ (empty - uses auth DTOs)
│   │   │
│   │   ├── audit/
│   │   │   ├── entities/
│   │   │   │   └── audit-log.entity.ts (AuditAction enum)
│   │   │   ├── audit.service.ts
│   │   │   ├── audit.module.ts
│   │   │   └── audit.controller.ts
│   │   │
│   │   ├── municipalities/              ⭐ NEW - Sprint 2
│   │   │   ├── entities/
│   │   │   │   └── municipality.entity.ts
│   │   │   ├── dtos/
│   │   │   │   └── municipality.dto.ts
│   │   │   ├── municipalities.service.ts
│   │   │   ├── municipalities.controller.ts
│   │   │   ├── municipalities.module.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── agreements/                  ⭐ NEW - Sprint 2
│   │   │   ├── entities/
│   │   │   │   └── agreement.entity.ts (AgreementStatus enum)
│   │   │   ├── dtos/
│   │   │   │   └── agreement.dto.ts
│   │   │   ├── agreements.service.ts
│   │   │   ├── agreements.controller.ts
│   │   │   ├── agreements.module.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── poa-periods/                 ⭐ NEW - Sprint 2
│   │   │   ├── entities/
│   │   │   │   └── poa-period.entity.ts (PoaPeriodStatus enum)
│   │   │   ├── dtos/
│   │   │   │   └── poa-period.dto.ts
│   │   │   ├── poa-periods.service.ts
│   │   │   ├── poa-periods.controller.ts
│   │   │   ├── poa-periods.module.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   └── health.module.ts
│   │   │
│   │   ├── app.module.ts (UPDATED - includes new modules)
│   │   ├── main.ts
│   │   └── index.ts
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── nest-cli.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (home)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx (UPDATED - with role selection)
│   │   │   ├── admin/
│   │   │   │   └── page.tsx
│   │   │   ├── municipalities/          ⭐ NEW - Sprint 2
│   │   │   │   └── page.tsx
│   │   │   ├── agreements/              ⭐ NEW - Sprint 2
│   │   │   │   ├── page.tsx (list)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx (detail + vigencias)
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.tsx (Protected wrapper)
│   │   │   ├── Sidebar.tsx (UPDATED - new routes)
│   │   │   ├── Topbar.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx (UPDATED - role parameter)
│   │   │   └── index.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts (API client with credentials)
│   │   │   └── utils.ts
│   │   │
│   │   └── hooks/
│   │       └── useAuth.ts (same as context.useAuth)
│   │
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── next.config.js
│
├── docker-compose.yml
├── .gitignore
│
└── 📄 Documentation/
    ├── SPRINT_1_SUMMARY.md
    ├── SPRINT_1_ADJUSTMENT_SUMMARY.md
    ├── SPRINT_2_SUMMARY.md (NEW)
    ├── SPRINT_2_TESTING_GUIDE.md (NEW)
    ├── PROJECT_STRUCTURE.md (this file)
    ├── TEST_RESULTS.md
    ├── README.md
    └── ARCHITECTURE.md

```

---

## 📊 Estadísticas del Proyecto

### Backend - Sprint 2

| Componente | Cantidad | Estado |
|-----------|----------|--------|
| Entidades | 6 | ✓ (User, AuditLog, Municipality, Agreement, PoaPeriod) |
| Servicios | 6 | ✓ (Users, Audit, Municipalities, Agreements, PoaPeriods) |
| Controladores | 6 | ✓ (Users, Audit, Municipalities, Agreements, PoaPeriods) |
| Módulos | 6 | ✓ Importados en AppModule |
| Endpoints API | 25+ | ✓ CRUD + Especiales |
| DTOs | 12+ | ✓ Create, Update, Filter, Response |
| Enums | 5 | ✓ UserRole, UserStatus, AgreementStatus, PoaPeriodStatus, AuditAction |
| Guards | 2 | ✓ JwtAuthGuard, RolesGuard |
| Decorators | 2 | ✓ @Roles(), @CurrentUser() |

### Frontend - Sprint 2

| Componente | Cantidad | Estado |
|-----------|----------|--------|
| Páginas | 5 | ✓ (Home, Login, Register, Admin, Municipalities, Agreements, Agreement Detail) |
| Componentes | 4 | ✓ (Layout, Sidebar, Topbar, Modal) |
| Context Providers | 1 | ✓ (AuthContext con useAuth hook) |
| Formularios | 7 | ✓ (Register, Login, Create Municipality, Create Agreement, Create POA, Assign Supervisor) |
| Tablas | 4 | ✓ (Admin Users, Municipalities, Agreements, POA Periods) |
| Filtros | 8 | ✓ (Search, Department filter x3, Status filter x2, Municipality filter) |
| Líneas de CSS | 50+ | ✓ Tailwind CSS (no archivos CSS separados) |

### Base de Datos

| Tabla | Campos | Relaciones | Índices |
|-------|--------|-----------|---------|
| users | 8 | 1 OneToMany (AuditLog) | email |
| audit_logs | 6 | 2 ManyToOne (User, User) | userId, action, createdAt |
| municipalities | 6 | 1 OneToMany (Agreement) | code, name, department |
| agreements | 8 | 2 ManyToOne + OneToMany | agreementNumber, municipalityId, status |
| poa_periods | 8 | 2 ManyToOne | year, agreementId, status |

---

## 🔄 Flujos de Datos

### Registro y Autenticación

```
User Input (Register)
    ↓
Frontend validateDatos + POST /auth/register (con role)
    ↓
Backend RegisterDto (validación @IsEnum(UserRole))
    ↓
AuthService.register() → crea User con status PENDING, role seleccionado
    ↓
User status: PENDING → no puede hacer login
    ↓
Admin aprueba → status: ACTIVE
    ↓
User puede hacer login → JWT en cookie httpOnly
    ↓
Frontend AuthContext.checkAuth() → user data
```

### Crear Municipio

```
Admin Input (Formulario)
    ↓
Frontend POST /municipalities
    ↓
Backend MunicipalitiesController (ADMIN only)
    ↓
MunicipalitiesService.create()
    ↓
Validación: código DANE único
    ↓
TypeORM.save(Municipality)
    ↓
Response 201 con municipio creado
    ↓
Frontend actualiza lista
```

### Crear Convenio → Vigencias POA → Asignar Supervisor

```
Coordinator Input (Crear Convenio)
    ↓
Frontend POST /agreements
    ↓
Backend AgreementsController (ADMIN, COORDINATOR)
    ↓
AgreementsService.create()
    ↓
Validaciones: municipio existe, número único, fechas válidas
    ↓
TypeORM.save(Agreement)
    ↓
OPCIÓN 1: Helper PoaPeriodsService.createDefaultPoaPeriods([2024, 2025])
    ↓
Response 201 + vigencias creadas
    ↓
Frontend muestra lista de convenios
    ↓
User click "Ver Vigencias" → GET /poa-periods/agreement/{id}
    ↓
Frontend muestra tabla con 2 vigencias (2024, 2025) sin supervisor
    ↓
Admin/Coordinator selecciona vigencia y supervisor
    ↓
PATCH /poa-periods/{id}/assign-supervisor
    ↓
PoaPeriodsService.assignSupervisor()
    ↓
Supervisor vinculado a vigencia
    ↓
Frontend refleja cambio en tabla
```

---

## 🔐 Control de Acceso

### Por Rol

```
ADMIN
├── POST /municipalities (crear)
├── GET /municipalities (listar)
├── POST /agreements (crear)
├── GET /agreements (listar)
├── POST /poa-periods (crear)
├── PATCH /poa-periods/:id/assign-supervisor (asignar supervisor)
└── GET /admin/* (ver dashboard admin)

SUPERVISOR_POA
├── GET /municipalities (listar)
├── GET /agreements (listar)
├── PATCH /poa-periods/:id/assign-supervisor (asignar supervisor a su vigencia)
├── GET /poa-periods/agreement/:id (ver vigencias)
└── ❌ POST /municipalities (prohibido)

COORDINATOR
├── POST /agreements (crear convenio)
├── GET /agreements (listar)
├── POST /poa-periods (crear vigencia POA)
├── PATCH /poa-periods/:id/assign-supervisor (asignar supervisor)
├── GET /municipalities (listar)
└── ❌ GET /admin/* (prohibido)

USER
├── GET /municipalities (listar)
├── GET /agreements (listar)
├── GET /poa-periods (listar)
└── ❌ POST /* (prohibido crear)
```

### Guard Chain

```
Request → JwtAuthGuard (verifica token válido)
            ↓
            ✓ Token válido → Extract User
            ↗
        RolesGuard (verifica rol requerido)
            ↓
            ✓ Rol válido → Permite acceso
            ✗ Rol inválido → ForbiddenException
```

---

## 📦 Dependencias Principales

### Backend

```json
{
  "@nestjs/common": "10.3.0",
  "@nestjs/core": "10.3.0",
  "@nestjs/passport": "10.0.1",
  "@nestjs/jwt": "11.0.1",
  "@nestjs/swagger": "7.1.11",
  "@nestjs/typeorm": "9.0.1",
  "typeorm": "0.3.17",
  "pg": "8.11.3",
  "passport-jwt": "4.0.1",
  "bcryptjs": "2.4.3",
  "class-validator": "0.14.0",
  "class-transformer": "0.5.1"
}
```

### Frontend

```json
{
  "react": "18",
  "next": "14",
  "typescript": "5",
  "tailwindcss": "3.4.1",
  "axios": "1.6.5"
}
```

---

## 🌐 API Endpoints - Resumen

### Municipalities
```
POST   /municipalities
GET    /municipalities
GET    /municipalities/departments
GET    /municipalities/:id
PATCH  /municipalities/:id
DELETE /municipalities/:id
```

### Agreements
```
POST   /agreements
GET    /agreements
GET    /agreements/:id
GET    /agreements/municipality/:municipalityId
PATCH  /agreements/:id
DELETE /agreements/:id
```

### POA Periods
```
POST   /poa-periods
GET    /poa-periods
GET    /poa-periods/:id
GET    /poa-periods/agreement/:agreementId
PATCH  /poa-periods/:id
PATCH  /poa-periods/:id/assign-supervisor
DELETE /poa-periods/:id
```

### Auth (Sprint 1)
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
POST   /auth/logout
```

### Admin (Sprint 1)
```
GET    /admin/users/pending
PATCH  /admin/users/:id/approve
PATCH  /admin/users/:id/reject
GET    /admin/users
```

---

## 🚀 Próximos Pasos

### Sprint 3: Actividades
- [ ] Entidad Activity
- [ ] CRUD de actividades dentro de vigencias POA
- [ ] Asignación de responsables
- [ ] Calendario de actividades

### Sprint 4: Indicadores
- [ ] Entidad Indicator
- [ ] Registro de avances
- [ ] Cálculo de cumplimiento
- [ ] Reportes de indicadores

### Sprint 5: Auditoría + Notificaciones
- [ ] Expandir AuditLog
- [ ] Notificaciones por email
- [ ] Sistema de alertas
- [ ] Historial de cambios

---

## 📝 Notas de Implementación

### TypeORM Synchronize
- En desarrollo: `synchronize: true` → crea/actualiza tablas automáticamente
- En producción: usar migrations

### JWT Strategy
- Token extraído de cookies (httpOnly)
- Validado en cada request protegido
- Expira en 24 horas

### Validaciones Multicapa
1. **Frontend**: validación local (clase-validator en DTOs)
2. **Backend**: validación en DTOs + lógica de negocio
3. **Base de datos**: constraints (unique, foreign keys)

### Relaciones en TypeORM
- `eager: false` en PoaPeriods para evitar N+1 queries
- Lazy loading en controller cuando se necesita

---

## ✅ Validación de Integridad

Ejecutar antes de producción:

```bash
# Backend
npm run lint
npm run test

# Frontend
npm run lint

# Database
SELECT * FROM pg_tables WHERE schemaname='public';
```

---

**Última actualización**: Sprint 2 Completo ✅
