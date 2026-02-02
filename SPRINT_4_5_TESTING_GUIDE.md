# 🧪 PRUEBAS SPRINT 4 Y 5 - POA TRACKER

## 📋 Flujo de Pruebas Completo

### **FASE 1: Configuración Inicial de Datos (5 min)**

#### 1.1 Verificar Usuarios Creados
```
✅ Inicia sesión como admin@example.com / admin123
   → Deberías ver el Dashboard
   → Confirmar que el rol es ADMIN
```

#### 1.2 Crear Municipios y Convenios
**Endpoint Manual o via API:**
```bash
POST http://localhost:4000/municipalities
Body: { "name": "Bogotá", "department": "Cundinamarca" }

POST http://localhost:4000/agreements
Body: {
  "agreementNumber": "2026-001",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "municipalityId": "{id-municipio}",
  "description": "Convenio POA 2026"
}
```

#### 1.3 Crear Período POA
```bash
POST http://localhost:4000/poa-periods
Body: {
  "year": 2026,
  "agreementId": "{id-convenio}",
  "status": "DRAFT"
}
```

---

### **FASE 2: Crear Estructura de Actividades POA**

#### 2.1 Verificar Programas
```bash
GET http://localhost:4000/programs
# Deberían existir: Renta Ciudadana, Compensación IVA, Renta Joven, etc.
```

#### 2.2 Crear Actividades POA
```bash
POST http://localhost:4000/poa-activities
Body: {
  "poaPeriodId": "{id-poa-period}",
  "programId": "{id-programa}",
  "description": "Actualizar base de datos de beneficiarios",
  "verificationSource": "Sistema SIPAD",
  "verificationDocumentType": "Reporte mensual",
  "quantitativeRecordDescription": "Base de datos en Excel",
  "nationalResponsible": "Dirección Nacional de Renta Ciudadana",
  "sourceApplication": "SIPAD",
  "reviewFrequency": "SEMESTRAL"
}
```

**Crear 3-4 actividades por programa para tener datos variados.**

---

### **FASE 3: Pruebas Sprint 4 - Revisión Semestral**

#### 3.1 Crear Revisión Semestral
```bash
POST http://localhost:4000/reviews
Body: {
  "agreementId": "{id-convenio}",
  "poaPeriodId": "{id-poa-period}",
  "semester": 1,
  "year": 2026,
  "notes": "Primera revisión semestral 2026"
}
```

**Respuesta esperada:**
```json
{
  "id": "uuid",
  "agreementId": "uuid",
  "status": "DRAFT",
  "semester": 1,
  "year": 2026,
  "createdAt": "2026-01-30T..."
}
```

#### 3.2 Obtener Detalles de la Revisión
```bash
GET http://localhost:4000/reviews/{review-id}
# Deberías ver la revisión con todas sus validaciones vacías
```

#### 3.3 Actualizar Validaciones en Bulk
```bash
PUT http://localhost:4000/validations
Body: {
  "validations": [
    {
      "id": "{validation-id-1}",
      "status": "CUMPLE",
      "observations": "Base de datos actualizada correctamente",
      "evidence": "Reporte SIPAD 2026-01"
    },
    {
      "id": "{validation-id-2}",
      "status": "NO_CUMPLE",
      "observations": "Base de datos desactualizada",
      "evidence": "Hallazgo en auditoría"
    },
    {
      "id": "{validation-id-3}",
      "status": "NO_APLICA",
      "observations": "Actividad no aplica para este convenio"
    }
  ]
}
```

#### 3.4 Cambiar Estado de la Revisión
```bash
PATCH http://localhost:4000/reviews/{review-id}/status
Body: {
  "status": "IN_PROGRESS"
}
# Estado: DRAFT → IN_PROGRESS

PATCH http://localhost:4000/reviews/{review-id}/status
Body: {
  "status": "CLOSED"
}
# Estado: IN_PROGRESS → CLOSED
# Se asigna automáticamente closedAt = now()
```

---

### **FASE 4: Pruebas Sprint 5 - Reportes y Estadísticas**

#### 4.1 Obtener Resumen General
```bash
GET http://localhost:4000/reports/summary?semester=1&year=2026
# Deberías ver KPIs:
# - cumple: 1 (33.3%)
# - noCumple: 1 (33.3%)
# - noAplica: 1 (33.3%)
# - pendiente: 0
# - total: 3
```

#### 4.2 Obtener Resumen por Municipio
```bash
GET http://localhost:4000/reports/municipality/{municipality-id}?semester=1&year=2026
# KPIs filtrados por municipio
```

#### 4.3 Obtener Resumen por Convenio
```bash
GET http://localhost:4000/reports/agreement/{agreement-id}?semester=1&year=2026
# KPIs filtrados por convenio con detalles de validaciones
```

---

### **FASE 5: Pruebas Frontend - UI**

#### 5.1 Página de Revisión Semestral (http://localhost:3000/reviews)

**Elementos esperados:**
- ✅ Título "Revisión Semestral"
- ✅ Card de información (Semestre 1 - 2026)
- ✅ Tabla con columnas:
  - Programa
  - Descripción
  - Estado (Select)
  - Observaciones (Input)
- ✅ Botón "💾 Guardar Avances"
- ✅ Botón "🔒 Cerrar Revisión"

**Acciones:**
1. Selecciona "✅ Cumple" en la primera actividad
2. Escribe una observación
3. Click "Guardar Avances"
4. Verifica que se actualicen en el backend

#### 5.2 Página de Reportes (http://localhost:3000/reports)

**Elementos esperados:**
- ✅ Filtros: Semestre y Año
- ✅ 4 Cards de KPIs:
  - Cumple (✅ verde)
  - No Cumple (❌ rojo)
  - No Aplica (N/A gris)
  - Pendiente (⏳ amarillo)
- ✅ Card de Resumen General:
  - Total Revisiones
  - Total Validaciones
  - Tasa de Cumplimiento

**Acciones:**
1. Cambia el semestre de 1 a 2
2. Verifica que los KPIs se actualicen
3. Cambia el año
4. Verifica que los datos cambien o muestren "No hay datos"

---

### **FASE 6: Flujo Integrado Supervisor (Demo)**

#### 6.1 Escenario: Supervisor POA revisa actividades
```
1. Login como: supervisor@example.com / supervisor123
   → Debería poder ver Dashboard
   
2. Ir a "Revisión Semestral"
   → Ve tabla de actividades del convenio asignado
   
3. Para cada actividad:
   - Selecciona estado (CUMPLE/NO_CUMPLE/NO_APLICA)
   - Escribe observación con detalles
   - Click "Guardar Avances"
   
4. Una vez validadas todas:
   - Click "Cerrar Revisión"
   - Confirma cierre
   - Status cambia a CLOSED
   
5. Ir a "Reportes"
   → Ve KPIs actualizados
   → Muestra: 2 CUMPLE, 1 NO_CUMPLE, 1 NO_APLICA
   → Tasa de cumplimiento: 50%
```

---

## 🐛 Checklist de Validación

### Backend
- [ ] Servidor compila sin errores
- [ ] Base de datos sincroniza entidades
- [ ] Tablas creadas: reviews, validations, poa_activities
- [ ] Relaciones FK correctas
- [ ] POST /reviews crea revisión con status DRAFT
- [ ] PUT /validations actualiza validaciones
- [ ] PATCH /reviews/{id}/status cambia estado
- [ ] GET /reports/* retorna KPIs correctos
- [ ] Calculadora de porcentajes funciona

### Frontend
- [ ] Página /reviews carga sin errores
- [ ] Tabla de actividades se renderiza
- [ ] Selects funcionan (CUMPLE/NO_CUMPLE/etc)
- [ ] Input de observaciones funciona
- [ ] Botón "Guardar Avances" envía PUT correcto
- [ ] Botón "Cerrar Revisión" envía PATCH correcto
- [ ] Página /reports carga sin errores
- [ ] Filtros (semestre, año) funcionan
- [ ] Cards de KPIs muestran números correctos
- [ ] Colores de porcentajes son apropiados

### Integración
- [ ] Frontend y backend se comunican
- [ ] JWT token persiste en requests
- [ ] Errores se manejan gracefully
- [ ] Mensajes de success/error aparecen

---

## 📊 Datos Esperados Después de Pruebas

```json
{
  "reviews": [
    {
      "id": "uuid-1",
      "agreementId": "uuid",
      "status": "CLOSED",
      "semester": 1,
      "year": 2026,
      "validations": [
        { "status": "CUMPLE", "observations": "..." },
        { "status": "NO_CUMPLE", "observations": "..." },
        { "status": "NO_APLICA", "observations": "..." }
      ]
    }
  ],
  "kpis": {
    "cumple": 1,
    "noCumple": 1,
    "noAplica": 1,
    "pendiente": 0,
    "cumplePercentage": 33.3,
    "noCumplePercentage": 33.3,
    "noAplicaPercentage": 33.3,
    "pendientePercentage": 0
  }
}
```

---

## 🚀 Próximos Pasos (Post-Pruebas)

- [ ] Resolver bugs encontrados
- [ ] Optimizar queries de reportes
- [ ] Agregar filtros avanzados
- [ ] Implementar gráficas (Chart.js/Recharts)
- [ ] Exportar reportes a PDF/Excel
- [ ] Historial de cambios de validaciones
- [ ] Notificaciones de estado de revisión
