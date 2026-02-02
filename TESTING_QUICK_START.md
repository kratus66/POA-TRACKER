# 🚀 QUICK START - COMANDOS DE TESTING

## ⚡ Setup Rápido (5 min)

### 1. Verificar que los servidores estén corriendo

```bash
# Backend (puerto 4000)
curl http://localhost:4000/health
# Expected: { "status": "UP" }

# Frontend (puerto 3000)
curl http://localhost:3000/login
```

### 2. Login y obtener token

```bash
# Admin
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Respuesta esperada:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "ADMIN",
    "status": "ACTIVE"
  }
}
```

**Guarda el token en una variable:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📝 CREAR DATOS DE PRUEBA

### 3. Crear Municipio

```bash
curl -X POST http://localhost:4000/municipalities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bogotá",
    "department": "Cundinamarca"
  }'

# Salva el ID: {municipality_id}
MUNICIPALITY_ID="uuid-aqui"
```

### 4. Crear Convenio

```bash
curl -X POST http://localhost:4000/agreements \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agreementNumber": "2026-001",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31",
    "municipalityId": "'$MUNICIPALITY_ID'",
    "description": "Convenio POA 2026",
    "status": "ACTIVE"
  }'

# Salva el ID: {agreement_id}
AGREEMENT_ID="uuid-aqui"
```

### 5. Crear POA Period

```bash
curl -X POST http://localhost:4000/poa-periods \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2026,
    "agreementId": "'$AGREEMENT_ID'",
    "status": "IN_PROGRESS"
  }'

# Salva el ID: {poa_period_id}
POA_PERIOD_ID="uuid-aqui"
```

### 6. Obtener Programas (ya existen)

```bash
curl -X GET http://localhost:4000/programs \
  -H "Authorization: Bearer $TOKEN"

# Salva al menos 2 IDs:
PROGRAM_1_ID="uuid-programa-1"
PROGRAM_2_ID="uuid-programa-2"
```

### 7. Crear Actividades POA

```bash
# Actividad 1
curl -X POST http://localhost:4000/poa-activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poaPeriodId": "'$POA_PERIOD_ID'",
    "programId": "'$PROGRAM_1_ID'",
    "description": "Actualizar base de datos de beneficiarios",
    "verificationSource": "Sistema SIPAD",
    "verificationDocumentType": "Reporte mensual",
    "quantitativeRecordDescription": "Archivo Excel con datos",
    "nationalResponsible": "Dirección Nacional de Renta",
    "sourceApplication": "SIPAD",
    "reviewFrequency": "SEMESTRAL"
  }'

# Salva los IDs de las actividades
ACTIVITY_1_ID="uuid-aqui"

# Actividad 2
curl -X POST http://localhost:4000/poa-activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poaPeriodId": "'$POA_PERIOD_ID'",
    "programId": "'$PROGRAM_2_ID'",
    "description": "Verificar pagos de compensación",
    "verificationSource": "Banco Central",
    "verificationDocumentType": "Reporte bancario",
    "quantitativeRecordDescription": "Reporte con transacciones",
    "nationalResponsible": "Dirección de Hacienda",
    "sourceApplication": "BANCARIA",
    "reviewFrequency": "SEMESTRAL"
  }'

ACTIVITY_2_ID="uuid-aqui"

# Actividad 3
curl -X POST http://localhost:4000/poa-activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poaPeriodId": "'$POA_PERIOD_ID'",
    "programId": "'$PROGRAM_1_ID'",
    "description": "Análisis de impacto social",
    "verificationSource": "Encuesta",
    "verificationDocumentType": "Reporte de encuesta",
    "quantitativeRecordDescription": "Resultados encuesta",
    "nationalResponsible": "Dirección de Evaluación",
    "sourceApplication": "ENCUESTA"
  }'

ACTIVITY_3_ID="uuid-aqui"
```

---

## ✅ SPRINT 4 - REVISIÓN SEMESTRAL

### 8. Crear Revisión

```bash
curl -X POST http://localhost:4000/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agreementId": "'$AGREEMENT_ID'",
    "poaPeriodId": "'$POA_PERIOD_ID'",
    "semester": 1,
    "year": 2026,
    "notes": "Revisión semestral 1 - 2026"
  }'

# Salva el ID
REVIEW_ID="uuid-aqui"

# Respuesta esperada:
{
  "id": "uuid",
  "agreementId": "uuid",
  "poaPeriodId": "uuid",
  "status": "DRAFT",
  "semester": 1,
  "year": 2026,
  "notes": "...",
  "createdAt": "2026-01-30..."
}
```

### 9. Obtener Revisión (con validaciones)

```bash
curl -X GET http://localhost:4000/reviews/$REVIEW_ID \
  -H "Authorization: Bearer $TOKEN"

# Deberías ver validaciones vacías (status: PENDIENTE)
```

### 10. Validar Actividades (Bulk Update)

```bash
curl -X PUT http://localhost:4000/validations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "validations": [
      {
        "id": "{validation-1-id}",
        "status": "CUMPLE",
        "observations": "Actividad completada en tiempo",
        "evidence": "Reporte SIPAD 2026-01-15"
      },
      {
        "id": "{validation-2-id}",
        "status": "NO_CUMPLE",
        "observations": "No se completaron pagos",
        "evidence": "Reporte bancario incompleto"
      },
      {
        "id": "{validation-3-id}",
        "status": "NO_APLICA",
        "observations": "No aplica para este convenio",
        "evidence": "Resolución 123"
      }
    ]
  }'

# Espera confirmación de 3 validaciones actualizadas
```

### 11. Cerrar Revisión

```bash
curl -X PATCH http://localhost:4000/reviews/$REVIEW_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CLOSED"
  }'

# Status cambia a CLOSED
# closedAt se asigna automáticamente
```

---

## 📊 SPRINT 5 - REPORTES

### 12. Obtener Resumen General

```bash
curl -X GET "http://localhost:4000/reports/summary?semester=1&year=2026" \
  -H "Authorization: Bearer $TOKEN"

# Respuesta esperada:
{
  "totalReviews": 1,
  "kpis": {
    "cumple": 1,
    "noCumple": 1,
    "noAplica": 1,
    "pendiente": 0,
    "total": 3,
    "cumplePercentage": 33.33,
    "noCumplePercentage": 33.33,
    "noAplicaPercentage": 33.33,
    "pendientePercentage": 0
  }
}
```

### 13. Obtener Reporte por Municipio

```bash
curl -X GET "http://localhost:4000/reports/municipality/$MUNICIPALITY_ID?semester=1&year=2026" \
  -H "Authorization: Bearer $TOKEN"

# Mismos KPIs pero filtrados por municipio
```

### 14. Obtener Reporte por Convenio

```bash
curl -X GET "http://localhost:4000/reports/agreement/$AGREEMENT_ID?semester=1&year=2026" \
  -H "Authorization: Bearer $TOKEN"

# KPIs + detalle de validaciones
{
  "agreementId": "...",
  "reviews": [
    {
      "id": "...",
      "status": "CLOSED",
      "validations": [
        {
          "id": "...",
          "status": "CUMPLE",
          "observations": "...",
          "activityDescription": "..."
        },
        ...
      ]
    }
  ],
  "kpis": { ... }
}
```

---

## 🎨 TESTING FRONTEND

### 15. Acceder a Revisión Semestral

```
URL: http://localhost:3000/reviews

✅ Deberías ver:
  - Título "Revisión Semestral"
  - Card con info (Semestre 1 - 2026)
  - Tabla con 3 actividades
  - Select de estado para cada una
  - Input de observaciones
  - Botones de guardar y cerrar
```

### 16. Validar Actividades (UI)

```
1. Click en select de primera actividad
2. Selecciona "✅ Cumple"
3. Escribe en observación: "Completada correctamente"
4. Click "💾 Guardar Avances"
5. Espera confirmación

✅ Deberías ver:
  - Mensaje de éxito
  - Los datos se guardan en backend
```

### 17. Cerrar Revisión (UI)

```
1. Click en "🔒 Cerrar Revisión"
2. Confirma en popup
3. Sistema envía PATCH /reviews/{id}/status

✅ Resultado:
  - Revisión cambia a estado CLOSED
  - Botón de cerrar desaparece
```

### 18. Acceder a Reportes

```
URL: http://localhost:3000/reports

✅ Deberías ver:
  - Filtros: Semestre (1-2), Año (2024-2026)
  - 4 Cards de KPIs:
    * ✅ Cumple (verde) - 1
    * ❌ No Cumple (rojo) - 1
    * N/A No Aplica (gris) - 1
    * ⏳ Pendiente (amarillo) - 0
  - Card de Resumen:
    * Total Revisiones: 1
    * Total Validaciones: 3
    * Tasa de Cumplimiento: 33.3%
```

### 19. Probar Filtros

```
1. Cambia semestre de 1 → 2
2. Los datos deberían cambiar o desaparecer
3. Cambia año a 2025
4. Deberría mostrar "No hay datos"
5. Vuelve a 2026
6. Deberían volver los datos
```

---

## 🔍 VERIFICACIÓN RÁPIDA

### Checklist de Validación

```bash
# 1. Backend compila sin errores
npm run build  # En backend/

# 2. Frontend sin errores
npm run build  # En frontend/

# 3. Endpoints responden
curl http://localhost:4000/health

# 4. Base de datos tiene tablas
# Verifica en pgAdmin:
# - reviews ✓
# - validations ✓
# - poa_activities ✓

# 5. Usuarios existen
# Login exitoso con admin@example.com

# 6. Flujo completo funciona
# Crear → Validar → Cerrar → Reportear
```

---

## 🎯 Resumen Rápido

| Paso | Comando | Esperado |
|------|---------|----------|
| Login | `POST /auth/login` | Token JWT |
| Municipio | `POST /municipalities` | ID creado |
| Convenio | `POST /agreements` | ID creado |
| POA Period | `POST /poa-periods` | ID creado |
| Actividades | `POST /poa-activities` (x3) | 3 IDs |
| Revisión | `POST /reviews` | ID, status: DRAFT |
| Validaciones | `PUT /validations` | 3 actualizado |
| Cerrar | `PATCH /reviews/{id}/status` | status: CLOSED |
| Reportes | `GET /reports/summary` | KPIs |
| UI Revisión | Ir a `/reviews` | Tabla de actividades |
| UI Reportes | Ir a `/reports` | Cards de KPIs |

---

## 💡 Tips

```bash
# Guardar token en archivo
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.access_token')

# Usar en todos los requests:
curl -H "Authorization: Bearer $TOKEN" ...

# Pretty print JSON
curl ... | jq .

# Guardar IDs en variables:
ID=$(curl ... | jq -r '.id')
```

---

## ⏱️ Tiempo Estimado

- Setup: **5 minutos**
- Crear datos: **10 minutos**
- Testing Sprint 4: **10 minutos**
- Testing Sprint 5: **5 minutos**
- Testing Frontend: **10 minutos**

**TOTAL: ~40 minutos** para ciclo completo

---

🚀 **¡LISTO PARA TESTING!**
