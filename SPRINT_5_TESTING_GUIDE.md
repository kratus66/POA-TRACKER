# 🧪 SPRINT 5 TESTING GUIDE

## ✅ SETUP INICIAL

### Prerrequisitos
```bash
# 1. Backend compilado
cd backend
npm run build

# 2. Frontend buildado
cd ../frontend
npm run build
```

### Iniciar Servicios
```bash
# En la raíz del proyecto
docker-compose up -d

# Esperar 30 segundos para que todo inicie
sleep 30

# Verificar status
docker-compose ps
```

---

## 🧪 FASES DE TESTING

### **FASE 1: Autenticación (5 min)**

```bash
# 1. Login como Admin
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Copiar el token retornado
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Verificar token (Hello endpoint)
curl -X GET http://localhost:4000/health \
  -H "Authorization: Bearer $TOKEN"

# Resultado esperado: { "status": "ok" }
```

✅ **RESULTADO ESPERADO:** Login exitoso, token válido

---

### **FASE 2: Crear Activity Tracking (10 min)**

#### Paso 1: Obtener una Validación existente
```bash
# Primero obtener reviews para conseguir validations
curl -X GET http://localhost:4000/reviews \
  -H "Authorization: Bearer $TOKEN"

# Si no hay reviews, crear uno primero:
curl -X POST http://localhost:4000/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agreementId": "{agreement-uuid}",
    "poaPeriodId": "{poa-period-uuid}",
    "semester": 1,
    "year": 2026,
    "notes": "Revisión semestral"
  }'

# Copiar validationId de la respuesta
VALIDATION_ID="xxx-xxx-xxx"
```

#### Paso 2: Crear seguimiento
```bash
curl -X POST http://localhost:4000/activity-tracking \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "validationId": "'$VALIDATION_ID'",
    "status": "CUMPLE",
    "observation": "Actividad completada satisfactoriamente",
    "quantitativeValue": 92.5,
    "quantitativeUnit": "%",
    "reviewerId": "{admin-uuid}",
    "trackingDate": "2026-02-01",
    "supportingDocumentation": "Reporte_enero_2026.pdf"
  }'

# Guardar el ID retornado
TRACKING_ID="yyy-yyy-yyy"
```

✅ **RESULTADO ESPERADO:** 
- Status 201 Created
- Retorna tracking con todos los campos

---

### **FASE 3: Operaciones CRUD (15 min)**

#### Listar todos los seguimientos
```bash
curl -X GET http://localhost:4000/activity-tracking \
  -H "Authorization: Bearer $TOKEN"

# Con filtro de validación
curl -X GET "http://localhost:4000/activity-tracking?validationId=$VALIDATION_ID" \
  -H "Authorization: Bearer $TOKEN"
```

#### Obtener detalles
```bash
curl -X GET http://localhost:4000/activity-tracking/$TRACKING_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### Actualizar seguimiento
```bash
curl -X PATCH http://localhost:4000/activity-tracking/$TRACKING_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "NO_CUMPLE",
    "observation": "No se completó a tiempo",
    "quantitativeValue": 45.0,
    "quantitativeUnit": "%"
  }'
```

#### Obtener estadísticas
```bash
curl -X GET http://localhost:4000/activity-tracking/statistics/$VALIDATION_ID \
  -H "Authorization: Bearer $TOKEN"

# Resultado esperado:
# {
#   "totalRecords": 1,
#   "averageQuantitativeValue": 92.5,
#   "latestStatus": "CUMPLE",
#   "statusDistribution": {
#     "CUMPLE": 1,
#     "NO_CUMPLE": 0,
#     "NO_APLICA": 0,
#     "PENDIENTE": 0
#   }
# }
```

#### Obtener historial
```bash
curl -X GET http://localhost:4000/activity-tracking/history/$VALIDATION_ID \
  -H "Authorization: Bearer $TOKEN"
```

✅ **RESULTADO ESPERADO:** 
- Todos los endpoints retornan 200 OK
- Datos consistentes

---

### **FASE 4: Bulk Operations (10 min)**

```bash
curl -X POST http://localhost:4000/activity-tracking/bulk \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trackings": [
      {
        "validationId": "'$VALIDATION_ID'",
        "status": "CUMPLE",
        "quantitativeValue": 100,
        "quantitativeUnit": "%",
        "observation": "Seguimiento 1",
        "reviewerId": "{admin-uuid}",
        "trackingDate": "2026-02-02"
      },
      {
        "validationId": "'$VALIDATION_ID'",
        "status": "NO_CUMPLE",
        "quantitativeValue": 50,
        "quantitativeUnit": "%",
        "observation": "Seguimiento 2",
        "reviewerId": "{admin-uuid}",
        "trackingDate": "2026-02-03"
      }
    ]
  }'
```

✅ **RESULTADO ESPERADO:**
- Se crean múltiples registros
- Array retornado con todos los IDs

---

### **FASE 5: Frontend Testing (20 min)**

#### 5.1 Acceder a Activity Tracking
```
1. Abrir http://localhost:3000
2. Login con admin@example.com / admin123
3. En sidebar, buscar "Seguimiento de Actividades"
4. Click en la opción
```

✅ **RESULTADO ESPERADO:**
- Página carga correctamente
- Se muestran los seguimientos creados
- Tabla con columnas: Fecha, Estado, Valor Cuantitativo, Observación

#### 5.2 Filtrar seguimientos
```
1. En sección "Filtros"
2. Seleccionar Estado: "✅ Cumple"
3. Seleccionar rango de fechas
4. Verificar que la tabla se filtra
```

✅ **RESULTADO ESPERADO:**
- Filtros funcionan en tiempo real
- Solo aparecen registros que coinciden

#### 5.3 Crear nuevo registro
```
1. Click en botón "➕ Nuevo Registro"
2. Se abre modal con formulario
3. Llenar campos:
   - Estado: "CUMPLE"
   - Fecha: "2026-02-02"
   - Valor: "85.5"
   - Unidad: "%"
   - Observación: "Test"
4. Click "💾 Guardar"
```

✅ **RESULTADO ESPERADO:**
- Modal se cierra
- Nuevo registro aparece en tabla
- Se hace POST /activity-tracking

#### 5.4 Editar registro
```
1. En tabla, buscar un registro
2. Click en "✏️ Editar"
3. Modal abre en modo edición
4. Cambiar Estado a "NO_CUMPLE"
5. Click "💾 Guardar"
```

✅ **RESULTADO ESPERADO:**
- Status en tabla cambia
- Se hace PATCH /activity-tracking/:id

#### 5.5 Eliminar registro
```
1. Click en "🗑️ Eliminar" de un registro
2. Confirmar eliminación
```

✅ **RESULTADO ESPERADO:**
- Se hace DELETE /activity-tracking/:id
- Registro desaparece de tabla

---

### **FASE 6: Reviews Page Testing (15 min)**

#### 6.1 Acceder a Revisiones
```
1. En sidebar: "Revisión Semestral"
2. Se muestra grid de revisiones disponibles
3. Cada card muestra: Semestre, Año, Estado, Cantidad de actividades
```

✅ **RESULTADO ESPERADO:**
- Cards cargan correctamente
- Se muestran reviews del sistema

#### 6.2 Abrir revisión
```
1. Click en una card de revisión
2. Se abre página de detalles
3. Muestra tabla editable de validaciones
```

✅ **RESULTADO ESPERADO:**
- Tabla tiene columnas:
  * Programa
  * Descripción
  * Estado (select editable)
  * Valor (editable)
  * Observación (editable)
  * Acciones

#### 6.3 Editar validaciones
```
1. Click en "✏️ Editar" de una fila
2. Los inputs se vuelven editables
3. Cambiar:
   - Estado: "CUMPLE"
   - Valor: "95.5"
   - Unidad: "%"
   - Observación: "Validado"
4. Click "✓ Guardar"
```

✅ **RESULTADO ESPERADO:**
- Se hace PUT /validations
- Fila se actualiza
- Valores persisten

#### 6.4 Cerrar revisión
```
1. Click en botón "🔒 Cerrar Revisión"
2. Confirmar en diálogo
3. Estado cambia a "CLOSED"
4. Botón "Editar" se deshabilita
```

✅ **RESULTADO ESPERADO:**
- Se hace PATCH /reviews/:id/status
- Reviews no se puede editar
- Estado es read-only

---

### **FASE 7: Reports Page Testing (15 min)**

#### 7.1 Acceder a Reportes
```
1. En sidebar: "Reportes"
2. Se muestra sección de filtros
3. Se muestran KPI cards
```

✅ **RESULTADO ESPERADO:**
- Page carga correctamente
- Filtros están disponibles

#### 7.2 Filtrar por semestre/año
```
1. Seleccionar Semestre: 1
2. Seleccionar Año: 2026
3. Los KPIs se actualizan automáticamente
```

✅ **RESULTADO ESPERADO:**
- GET /reports/summary?semester=1&year=2026
- KPIs reflejan los datos corretos
- Se muestran porcentajes

#### 7.3 Ver KPI Cards
```
1. Verificar 4 cards:
   - ✅ Cumple (verde)
   - ❌ No Cumple (rojo)
   - N/A No Aplica (gris)
   - ⏳ Pendiente (amarillo)

2. Cada card muestra:
   - Número absoluto
   - Porcentaje
   - Barra visual de progreso
```

✅ **RESULTADO ESPERADO:**
- Cards con colores correctos
- Barras de progreso proporcionales
- Porcentajes suman 100%

#### 7.4 Ver Resumen General
```
1. Scroll down en la página
2. Ver card "Resumen General" con:
   - Total de Revisiones
   - Total de Validaciones
   - Tasa de Cumplimiento (%)
```

✅ **RESULTADO ESPERADO:**
- Números son consistentes
- Tasa de cumplimiento = (Cumple / Total) * 100

#### 7.5 Filtrar por Municipio
```
1. Vista: cambiar a "Por Municipio"
2. Municipio: seleccionar uno
3. Los reportes se actualizan
```

✅ **RESULTADO ESPERADO:**
- GET /reports/municipality/{id}?semester=1&year=2026
- KPIs solo del municipio seleccionado

---

## 📊 CHECKLIST DE VALIDACIÓN

### Backend
- [ ] ActivityTracking entity creada sin errores
- [ ] Relaciones configuradas correctamente
- [ ] Todos los endpoints retornan 200/201
- [ ] CRUD completo funciona
- [ ] Bulk create funciona
- [ ] Statistics calcula correctamente
- [ ] History retorna en orden DESC por fecha
- [ ] Validación actualiza validations
- [ ] Reviews actualiza review status

### Frontend
- [ ] Activity Tracking page carga
- [ ] Filtros funcionan correctamente
- [ ] Crear nuevo registro funciona
- [ ] Editar registro funciona
- [ ] Eliminar registro funciona
- [ ] Reviews page carga
- [ ] Tabla editable de validaciones funciona
- [ ] Cerrar revisión funciona
- [ ] Reports page carga
- [ ] KPI cards se actualizan
- [ ] Filtros en reports funcionan
- [ ] Reporte por municipio funciona

### Data Integrity
- [ ] Los cambios persisten en BD
- [ ] Las relaciones se mantienen
- [ ] No hay valores null inesperados
- [ ] Las fechas se guardan correctamente

---

## 🔧 Troubleshooting

### Error: "validationId not found"
```
Solución:
1. Asegurar que la validationId existe
2. Verificar que la Review tiene validations
3. GET /reviews para verificar
```

### Error: "Cannot PATCH reviews"
```
Solución:
1. Si es CLOSED, no se puede editar
2. Abrir una nueva revisión
3. O PATCH con status REOPENED
```

### Error: "Unauthorized"
```
Solución:
1. Verificar token no expiró
2. Obtener nuevo token con login
3. Incluir en header: Authorization: Bearer {token}
```

---

## 📈 Métricas Esperadas

Después del testing:
- ✅ 100% de endpoints respondiendo
- ✅ Cero errores en frontend
- ✅ Datos consistentes en BD
- ✅ Filtros funcionando correctamente
- ✅ KPIs calculados con precisión

---

## ✅ PRÓXIMO PASO

Después de completar este testing:
1. Documentar cualquier bug encontrado
2. Ejecutar load testing si es necesario
3. Validar con usuarios reales
4. Ir a Sprint 6 (Exportación de reportes)

---

**Testing completado:** ✅ **SPRINT 5 LISTO PARA PRODUCCIÓN**
