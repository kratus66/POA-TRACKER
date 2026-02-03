# ✅ ANÁLISIS DETALLADO - QUÉ FALTA IMPLEMENTAR

**Fecha**: 3 de febrero de 2026  
**Estado**: Análisis post Sprint 6-7  
**Request**: Ajuste de Temas, Módulo Compromisos, Dashboard PowerBI

---

## 🔍 RESUMEN EJECUTIVO

Del **CHANGE REQUEST** solicitado, a continuación se detalla:
- ✅ **IMPLEMENTADO**: ~35%
- ⏳ **PARCIALMENTE IMPLEMENTADO**: ~20%
- ❌ **NO IMPLEMENTADO**: ~45%

---

## 1️⃣ CORRECCIÓN DE TEMAS (5 TEMAS OFICIALES)

### Estado: ❌ NO IMPLEMENTADO

**Requerimiento:**
Los 5 temas macro deben ser EXACTAMENTE:
1. Recursos
2. Oferta Institucional
3. Ciclo Operativo
4. Componente Social y Comunitario
5. Coordinación y Seguimiento

### Lo que falta:

#### a) **Crear entidad Theme**
- ❌ No existe tabla `themes` en la BD
- ❌ No existe entidad `Theme` en backend
- ❌ Los temas están hardcodeados en excel o como texto en validaciones

**Cambios necesarios:**
```
Crear: backend/src/poa-themes/
├── entities/
│   └── poa-theme.entity.ts (id, sheetKey, title, description, active, createdAt, updatedAt)
├── dtos/
│   ├── create-poa-theme.dto.ts
│   ├── update-poa-theme.dto.ts
│   └── filter-poa-theme.dto.ts
├── poa-themes.service.ts
├── poa-themes.controller.ts
└── poa-themes.module.ts
```

#### b) **Relaciones en Entidades Existentes**
- ❌ `PoaTemplateActivity` no tiene relación con temas
- ❌ `AgreementActivity` no tiene relación con temas
- ❌ `PoaActivity` no tiene relación con temas
- ❌ `Validation` no captura el tema

**Cambios necesarios:**
- Agregar `themeId` + relación `@ManyToOne` en:
  - `PoaTemplateActivity`
  - `AgreementActivity`
  - `PoaActivity`
  - `Validation`

#### c) **Seeder Actualizado**
- ⏳ PARCIALMENTE: El seeder `poa-templates.seeder.ts` existe pero no mapea temas oficiales
- ❌ No mapea variaciones de nombres de hojas Excel a los 5 títulos oficiales

**Cambios necesarios:**
```
Actualizar: backend/src/seeders/poa-templates.seeder.ts
- Leer Excel y detectar hojas
- Mapear:
  * "recursos" / "Recursos" → "Recursos"
  * "oferta institucional" / "oferta inst" → "Oferta Institucional"
  * "ciclo operativo" / "ciclo op" → "Ciclo Operativo"
  * "componente social y comunitario" / "comp soc y com" → "Componente Social y Comunitario"
  * "coordinación y seguimiento" / "coord y seg" → "Coordinación y Seguimiento"
- Crear/actualizar Themes con título oficial y sheetKey original
```

#### d) **Configuración en BD (TypeORM)**
- ❌ `app.module.ts` no importa entidad `Theme`
- ❌ `Theme` no está en la lista de entidades sincronizadas

---

## 2️⃣ MÓDULO COMPROMISOS (NUEVO - OBLIGATORIO)

### Estado: ⏳ PARCIALMENTE IMPLEMENTADO (estructura inicial existe, lógica NO)

**Requerimiento:**
- Si `AgreementActivity.validationStatus = NO_CUMPLIDA | PENDIENTE` → Crear COMPROMISO
- Validar en siguiente semestre
- Mostrar automáticamente "Compromisos abiertos del semestre anterior"
- Status: OPEN/CLOSED
- Responsables: MUNICIPAL_TEAM / PROGRAM_COORDINATOR

### Lo que falta:

#### a) **Backend - Entidad Compromise**
✅ EXISTE: `frontend/src/app/commitments/` (estructura parcial)  
❌ FALTA: `backend/src/commitments/`

**Cambios necesarios:**
```
Crear: backend/src/commitments/
├── entities/
│   └── commitment.entity.ts (id, description, dueDate, responsibleRole, 
│                              status, closureNotes, closedAt, createdBy, 
│                              createdAt, updatedAt, reviewCycleId, agreementActivityId)
├── dtos/
│   ├── create-commitment.dto.ts
│   ├── update-commitment.dto.ts
│   └── filter-commitment.dto.ts
├── commitments.service.ts
├── commitments.controller.ts
└── commitments.module.ts
```

#### b) **Relaciones y Lógica**
- ❌ `Review` (reviewCycle) no tiene relación con `Commitment`
- ❌ No hay validación automática: si `validationStatus = NO_CUMPLIDA` → permitir crear compromiso
- ❌ No hay carga automática de "Compromisos abiertos del semestre anterior" en nuevo review

**Cambios necesarios:**
- Agregar en `Review.entity.ts`:
  ```typescript
  @OneToMany(() => Commitment, (commitment) => commitment.review)
  commitments?: Commitment[];
  ```
- Agregar en `AgreementActivity.entity.ts`:
  ```typescript
  @OneToMany(() => Commitment, (commitment) => commitment.activity)
  commitments?: Commitment[];
  ```

#### c) **Servicio - Lógica de Negocio**
- ❌ No existe lógica para:
  - Crear compromiso solo si validación está NO_CUMPLIDA/PENDIENTE
  - Cargar compromisos abiertos del semestre anterior cuando se crea nuevo review
  - Mostrar compromiso como VENCIDO si `dueDate < today` y `status = OPEN`

#### d) **Frontend - Componentes**
✅ EXISTE: `frontend/src/app/commitments/page.tsx` (básico)  
❌ FALTA:
- Modal para crear compromiso desde validación
- Lista de compromisos abiertos por semestre
- Panel de cierre de compromisos
- Validación de vencimiento

---

## 3️⃣ MÓDULO CATÁLOGO POA (Separación)

### Estado: ✅ PARCIALMENTE IMPLEMENTADO

**Requerimiento:** Separar totalmente de "Convenios"

### Lo que existe:
- ✅ Tablas: `poa_templates`, `poa_template_activities`, `poa_activities`
- ✅ Módulos: `poa-templates/`, `poa-activities/`
- ✅ CRUD básico en backend

### Lo que falta:
- ⏳ Separación clara en frontend (actualmente mezclado en `/poas` y `/agreements`)
- ❌ No hay validación de: "Un programa solo puede usarse en 1 convenio por año"
- ❌ No hay interfaz clara: Ver programa → Temas (5) → Actividades de plantilla

---

## 4️⃣ MÓDULO SEGUIMIENTO SEMESTRAL (Actualización)

### Estado: ✅ PARCIALMENTE IMPLEMENTADO

**Módulo existente:** `reviews/` + `validations/` + `evidences/`

### Lo que existe:
- ✅ `Review` (semestral, estado)
- ✅ `Validation` (cumplimiento: CUMPLIDA/NO_CUMPLIDA/NO_APLICA/PENDIENTE)
- ✅ `Evidence` (carga de archivos)
- ✅ `ActivityTracking`

### Lo que falta:
- ❌ Bloqueo total cuando `Review.status = CLOSED`:
  - ❌ Bloquear carga de evidencias
  - ❌ Bloquear respuestas a preguntas
  - ❌ Bloquear cambios en cumplimiento
  - ❌ Bloquear edición de compromisos
- ❌ Solo `REGIONAL_MANAGER` puede CERRAR semestre
- ❌ Solo `REGIONAL_MANAGER` puede REOPEN semestre
- ❌ Validación: Solo `PROGRAM_COORDINATOR` cambia cumplimiento + observaciones
- ❌ `MUNICIPAL_TEAM` SOLO evidencia/preguntas (no modifica cumplimiento)

**Cambios necesarios:**
- Agregar en `Review.entity.ts`:
  ```typescript
  @Column({ nullable: true })
  closedBy?: string; // userId de quien cerró
  
  @Column({ nullable: true })
  reopenedBy?: string; // userId de quien reabrió
  ```
- Agregar guards/middleware:
  - Verificar rol antes de cerrar/reabrir
  - Bloquear acciones si `status = CLOSED`

---

## 5️⃣ DASHBOARD (NUEVO - OBLIGATORIO)

### Estado: ❌ NO IMPLEMENTADO

**Requerimiento:**
- Dashboard tipo PowerBI con Recharts
- Para: `REGIONAL_MANAGER` + `PROGRAM_COORDINATOR`
- Filtros: año, semestre, departamento, municipio, convenio, programa, tema

### Lo que falta:

#### a) **Endpoints Backend**
- ❌ No existen endpoints de dashboard
- ❌ No hay cálculo de KPIs por filtro
- ❌ No hay datos agrupados por municipio/convenio/programa/tema

**Cambios necesarios - Crear en `ReportsModule` o nuevo `DashboardModule`:**
```
GET /dashboard/kpis?year=2024&semester=1&department=...
GET /dashboard/compliance-by-program?...
GET /dashboard/municipalities-ranking?...
GET /dashboard/commitments-panel?...
GET /dashboard/drilldown?department=...&municipality=...&agreement=...
```

#### b) **Lógica de KPIs**
- ❌ No está implementado cálculo de:
  ```
  % cumplimiento = (CUMPLIDA / total) * 100
  % no_cumplida = (NO_CUMPLIDA / total) * 100
  % pendiente = (PENDIENTE / total) * 100
  % no_aplica = (NO_APLICA / total) * 100
  ```
- ❌ No hay agregación por:
  - Departamento
  - Municipio
  - Convenio
  - Programa
  - Tema

#### c) **Gráficos Requeridos (Frontend con Recharts)**
- ❌ Donut: Distribución por estado (CUMPLIDA/NO_CUMPLIDA/PENDIENTE/NO_APLICA)
- ❌ Stacked Bars: Cumplimiento por Programa
- ❌ Ranking Tabla: Municipios con menor cumplimiento (heat map)
- ❌ Panel Compromisos: 
  - Abiertos vs Cerrados
  - Vencidos
  - Arrastrados del semestre anterior
- ❌ Drilldown interactivo:
  - Click en departamento → ver municipios
  - Click en municipio → ver convenios
  - Click en convenio → ver programas
  - Click en programa → ver temas
  - Click en tema → ver actividades

#### d) **Rutas y Componentes Frontend**
- ⏳ EXISTE: `frontend/src/app/dashboard/page.tsx` (vacío)
- ❌ FALTA:
  ```
  frontend/src/app/dashboard/
  ├── page.tsx (componente principal)
  ├── components/
  │   ├── KpiCards.tsx
  │   ├── ComplianceDonut.tsx
  │   ├── ProgramStackedBars.tsx
  │   ├── MunicipalitiesRanking.tsx
  │   ├── CommitmentsPanel.tsx
  │   ├── Drilldown.tsx
  │   └── DashboardFilters.tsx
  ├── hooks/
  │   └── useDashboardData.ts
  └── types/
      └── dashboard.types.ts
  ```

---

## 6️⃣ ROLES Y PERMISOS (Confirmación)

### Estado: ✅ PARCIALMENTE IMPLEMENTADO

**Roles confirmados:**
1. `ADMIN` - Acceso total
2. `REGIONAL_MANAGER` - Cierra semestre, reabre
3. `PROGRAM_COORDINATOR` - Marca cumplimiento, crea compromisos
4. `MUNICIPAL_TEAM` - Carga evidencias, responde preguntas

### Lo que existe:
- ✅ Enum en `User.entity.ts`
- ✅ Guards básicos en auth

### Lo que falta:
- ⏳ Validación específica:
  - ❌ `MUNICIPAL_TEAM` NO puede cambiar cumplimiento
  - ❌ `PROGRAM_COORDINATOR` SOLO puede cambiar cumplimiento
  - ❌ `REGIONAL_MANAGER` SOLO puede cerrar/reabrir
  - ❌ Dashboard solo visible para `REGIONAL_MANAGER` + `PROGRAM_COORDINATOR`

---

## 7️⃣ MIGRACIÓN DE DATOS

### Estado: ❌ NO IMPLEMENTADO

**Necesario:**
- ❌ Migración: Mapear temas actuales (si existen) a los 5 temas oficiales
- ❌ Migración: Crear registros en tabla `themes` nuevos
- ❌ Migración: Actualizar referencias en `poa_template_activities`, `agreement_activities`, etc.

---

## 📋 MATRIZ DE IMPLEMENTACIÓN

| **Característica** | **Módulo** | **Backend** | **Frontend** | **Estado** |
|---|---|---|---|---|
| **Temas (5 oficiales)** | poa-themes | ❌ No existe | ⏳ Parcial | NO |
| Seeder actualizado | Seeders | ⏳ Parcial | - | PARCIAL |
| Validación de Temas | Validations | ❌ No | ❌ No | NO |
| **Compromisos CRUD** | commitments | ❌ No existe | ⏳ Parcial | NO |
| Lógica auto-compromiso | commitments | ❌ No | ❌ No | NO |
| Panel compromisos frontend | commitments | - | ❌ No | NO |
| **Bloqueos CLOSED** | reviews | ⏳ Parcial | ❌ No | PARCIAL |
| Cierre por REGIONAL_MANAGER | reviews | ⏳ Parcial | ❌ No | PARCIAL |
| MUNICIPAL_TEAM solo evidencia | auth/guards | ❌ No | ❌ No | NO |
| **Dashboard KPIs** | reports | ❌ No | ❌ No | NO |
| Gráficos (Donut, Bars) | reports | - | ❌ No | NO |
| Ranking Municipios | reports | ❌ No | ❌ No | NO |
| Panel Compromisos | reports | ❌ No | ❌ No | NO |
| Drilldown | reports | ❌ No | ❌ No | NO |
| Filtros Dashboard | reports | ❌ No | ❌ No | NO |

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

### **FASE 1: FUNDACIÓN (Semana 1)**
1. ✅ Crear entidad `Theme` + CRUD
2. ✅ Actualizar seeder (mapeo de 5 temas)
3. ✅ Agregar relaciones en `PoaTemplateActivity`, `AgreementActivity`, `PoaActivity`
4. ✅ Migración de datos

### **FASE 2: COMPROMISOS (Semana 2)**
5. ✅ Crear entidad `Commitment` + CRUD
6. ✅ Relaciones: `Review` ↔ `Commitment`
7. ✅ Validación: Auto-crear compromiso si NO_CUMPLIDA/PENDIENTE
8. ✅ Carga automática de compromisos abiertos en nuevo review
9. ✅ Frontend: Componentes y lógica

### **FASE 3: BLOQUEOS Y PERMISOS (Semana 2)**
10. ✅ Bloqueo total cuando `Review.status = CLOSED`
11. ✅ Validación de roles: solo REGIONAL_MANAGER cierra/reabre
12. ✅ Guard: MUNICIPAL_TEAM solo evidencia
13. ✅ Guard: PROGRAM_COORDINATOR solo cumplimiento

### **FASE 4: DASHBOARD (Semana 3)**
14. ✅ Endpoints de KPIs (backend)
15. ✅ Cálculos de porcentajes y agregaciones
16. ✅ Componentes de gráficos (Recharts)
17. ✅ Filtros dinámicos
18. ✅ Drilldown interactivo
19. ✅ Panel de compromisos

### **FASE 5: TESTING Y AJUSTES (Semana 4)**
20. ✅ Tests unitarios
21. ✅ Tests E2E
22. ✅ Documentación
23. ✅ Deploy

---

## 💾 RESUMEN DE CAMBIOS DE BD

```sql
-- Nuevas Tablas
CREATE TABLE poa_themes (
  id UUID PRIMARY KEY,
  sheet_key VARCHAR NOT NULL,
  title VARCHAR NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commitments (
  id UUID PRIMARY KEY,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  responsible_role VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'OPEN',
  closure_notes TEXT,
  closed_at TIMESTAMP,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  review_cycle_id UUID NOT NULL,
  agreement_activity_id UUID NOT NULL,
  FOREIGN KEY (review_cycle_id) REFERENCES reviews(id),
  FOREIGN KEY (agreement_activity_id) REFERENCES agreement_activities(id)
);

-- Nuevas Columnas
ALTER TABLE poa_template_activities ADD COLUMN theme_id UUID;
ALTER TABLE agreement_activities ADD COLUMN theme_id UUID;
ALTER TABLE poa_activities ADD COLUMN theme_id UUID;
ALTER TABLE validations ADD COLUMN theme_id UUID;
ALTER TABLE reviews ADD COLUMN closed_by UUID;
ALTER TABLE reviews ADD COLUMN reopened_by UUID;

-- Índices
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_commitments_due_date ON commitments(due_date);
CREATE INDEX idx_poa_themes_title ON poa_themes(title);
```

---

## 📝 NOTAS IMPORTANTES

1. **Temas**: Son catálogos maestros, no debe permitirse duplicados por título
2. **Compromisos**: Auditar quién los crea y cierra
3. **Bloqueos**: Deben ser transversales (aplicar a validaciones, evidencias, compromisos, etc.)
4. **Dashboard**: Debe ser READ-ONLY para mostrar datos históricos
5. **Roles**: Implementar granularidad en guards para cada operación

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Tema: Entidad creada y seeder actualizado
- [ ] Tema: 5 títulos oficiales en BD
- [ ] Compromisos: Backend CRUD completo
- [ ] Compromisos: Lógica auto-crear y cargar
- [ ] Compromisos: Frontend componentes
- [ ] Bloqueos: Implementados en Review.status = CLOSED
- [ ] Permisos: Roles validados en cada endpoint
- [ ] Dashboard: Endpoints KPIs
- [ ] Dashboard: Gráficos Recharts
- [ ] Dashboard: Drilldown funcional
- [ ] Tests: Unit + E2E
- [ ] Documentación actualizada

