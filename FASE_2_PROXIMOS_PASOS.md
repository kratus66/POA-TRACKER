# 🎯 SIGUIENTE PASO: FASE 2 - MÓDULO COMPROMISOS

**Status**: ✅ FASE 1 COMPLETADA  
**Siguiente**: 🔧 FASE 2 - Implementar Commitments (Compromisos)  
**Estimado**: 2-3 días

---

## 📋 ¿QUÉ FALTA PARA FASE 2?

### **Estructura a crear:**
```
backend/src/commitments/
├── entities/
│   └── commitment.entity.ts           ← CREAR
├── dtos/
│   ├── create-commitment.dto.ts       ← CREAR
│   ├── update-commitment.dto.ts       ← CREAR
│   └── filter-commitment.dto.ts       ← CREAR (opcional)
├── commitments.service.ts             ← CREAR
├── commitments.controller.ts          ← CREAR
└── commitments.module.ts              ← CREAR
```

### **Cambios en entidades existentes:**
- ✏️ `Review.entity.ts`: Agregar relación `@OneToMany` a `Commitment`
- ✏️ `AgreementActivity.entity.ts`: Agregar relación `@OneToMany` a `Commitment`
- ✏️ `app.module.ts`: Importar `CommitmentsModule` y entidad `Commitment`

### **Lógica nueva (lo complejo):**
1. Cuando se marca una validación como `NO_CUMPLIDA` o `PENDIENTE`:
   - Permitir crear un COMPROMISO
   - Guardar: description, dueDate, responsibleRole, status, createdBy

2. Cuando se cierra un review (semestre):
   - Cargar automáticamente compromisos abiertos del semestre anterior
   - Mostrarlos en el nuevo review

3. Bloqueos cuando Review.status = CLOSED:
   - No se puede crear/editar/eliminar compromisos
   - Mensaje: "El semestre está cerrado"

---

## 🔄 FLUJO DE COMPROMISOS

```
VISTA GENERAL:
┌─────────────────────────────────┐
│ REVIEW (SEMESTRE) SEMESTRAL 1   │
└──────────────┬──────────────────┘
               │
        ┌──────▼──────┐
        │ ACTIVIDADES │
        └──────┬──────┘
               │
        ┌──────▼────────────┐
        │ VALIDACIÓN STATUS │
        └──────┬────────────┘
               │
    ┌──────────┼──────────────┐
    │          │              │
  CUMPLIDA   NO_CUMPLIDA   PENDIENTE ← Crear Compromiso
    │          │              │
    │       ┌──▼──┐        ┌──▼──┐
    │       │COMP.│        │COMP.│
    │       └─────┘        └─────┘
    │          │              │
    │          └──────┬───────┘
    │                 │
    │          SEMESTRE CERRADO ✓
    │                 │
    └─────────┬───────┘
              │
    ┌─────────▼──────────────┐
    │ REVIEW SEMESTRE 2      │
    │ (Cargar compromisos    │
    │  abiertos del sem. 1)  │
    └────────────────────────┘
```

---

## 📝 TABLA COMMITMENT (BD)

```sql
CREATE TABLE commitments (
  id UUID PRIMARY KEY,
  
  -- Contenido
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  closure_notes TEXT,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'OPEN'  -- OPEN | CLOSED
  responsible_role VARCHAR(50) NOT NULL,  -- MUNICIPAL_TEAM | PROGRAM_COORDINATOR
  
  -- Auditoría
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Relaciones
  review_cycle_id UUID NOT NULL,  -- FK a reviews
  agreement_activity_id UUID NOT NULL,  -- FK a agreement_activities
  
  FOREIGN KEY (review_cycle_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (agreement_activity_id) REFERENCES agreement_activities(id) ON DELETE CASCADE,
  
  INDEX idx_status (status),
  INDEX idx_due_date (due_date),
  INDEX idx_review_cycle_id (review_cycle_id),
  INDEX idx_agreement_activity_id (agreement_activity_id)
);
```

---

## 🔗 RELACIONES NECESARIAS

### En Review.entity.ts
```typescript
@OneToMany(() => Commitment, (commitment) => commitment.review, {
  cascade: true,
  eager: false,
})
commitments?: Commitment[];
```

### En AgreementActivity.entity.ts
```typescript
@OneToMany(() => Commitment, (commitment) => commitment.activity, {
  cascade: true,
  eager: false,
})
commitments?: Commitment[];
```

### En Commitment.entity.ts
```typescript
@ManyToOne(() => Review, (review) => review.commitments)
@JoinColumn({ name: 'reviewCycleId' })
review: Review;

@ManyToOne(() => AgreementActivity, (activity) => activity.commitments)
@JoinColumn({ name: 'agreementActivityId' })
activity: AgreementActivity;

@ManyToOne(() => User)
@JoinColumn({ name: 'createdBy' })
createdByUser?: User;
```

---

## 🛠️ PASOS EXACTOS PARA IMPLEMENTAR

### Paso 1: Crear entidad Commitment
- Campos según tabla anterior
- Enum: `CommitmentStatus { OPEN = 'OPEN', CLOSED = 'CLOSED' }`
- Relaciones bidireccionales

### Paso 2: Crear CRUD
- Service:
  - `create(agreementActivityId, dto)`: Crear compromiso si validación es NO_CUMPLIDA/PENDIENTE
  - `findAll(reviewCycleId)`: Listar compromisos de un semestre
  - `findOpen(reviewCycleId)`: Listar compromisos abiertos
  - `findOverdue(reviewCycleId)`: Listar compromisos vencidos (dueDate < hoy)
  - `close(id, closureNotes)`: Cerrar compromiso
  - `getPreviousCycleCommitments(agreementId, currentSemester)`: Cargar del semestre anterior

- Controller:
  - CRUD estándar + los métodos personalizados

### Paso 3: Validaciones
- Al crear: validar que la actividad tenga validación NO_CUMPLIDA/PENDIENTE
- Al cerrar semestre: NO permitir crear nuevos compromisos si Review.status = CLOSED
- Vencimiento: marcar como "VENCIDO" si dueDate < hoy y status = OPEN

### Paso 4: Actualizar entidades relacionadas
- Review.entity.ts: Agregar relación
- AgreementActivity.entity.ts: Agregar relación
- Validation.entity.ts: Posible referencia (opcional)

### Paso 5: app.module.ts
- Importar CommitmentsModule
- Agregar Commitment a lista de entidades

### Paso 6: Frontend (después)
- Componente para crear compromiso desde validación
- Modal con: description, dueDate, responsableRole
- Lista de compromisos por semestre
- Panel para cerrar compromisos

---

## 💡 PREGUNTAS ANTES DE EMPEZAR

1. **¿El createdBy debe ser el usuario autenticado?**
   - Sí, obtenerse del JWT
   
2. **¿Un compromiso puede ser editado después de creado?**
   - Sí, mientras status = OPEN y semestre NO esté cerrado
   
3. **¿Qué datos necesita el frontend cuando carga compromisos?**
   - agreement_activity (nombre), description, dueDate, status, createdAt, responsibleRole

4. **¿Los compromisos del semestre anterior se cargan automáticamente?**
   - Sí, cuando se crea un nuevo Review (semestre siguiente)

---

## ✅ CHECKLIST FASE 2

- [ ] Crear entidad Commitment
- [ ] Crear DTOs
- [ ] Crear service con lógica compleja
- [ ] Crear controller con endpoints
- [ ] Crear módulo
- [ ] Actualizar Review.entity.ts
- [ ] Actualizar AgreementActivity.entity.ts
- [ ] Actualizar app.module.ts
- [ ] Compilación sin errores
- [ ] Documentación de endpoints
- [ ] Tests unitarios
- [ ] Frontend: componentes básicos

---

## 🚀 COMANDO PARA EMPEZAR

```bash
# Cuando estés listo, avísame y comenzamos con FASE 2
# Necesitaremos:
# 1. Confirmar la lógica de compromisos
# 2. Crear la entidad
# 3. Implementar el servicio
# 4. Agregar relaciones
# 5. Hacer funcionar el backend
# 6. Crear frontend (después)
```

---

¿Quieres empezar con FASE 2 ahora? 🚀
