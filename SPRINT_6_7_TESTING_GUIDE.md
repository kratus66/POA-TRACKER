# 🧪 TESTING GUIDE - SPRINT 6 + 7

**Total de Fases:** 5  
**Tiempo Estimado:** 45 minutos  
**Prerequisito:** Backend y Frontend corriendo en localhost

---

## ⚙️ Setup Inicial

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Testing (opcional)
cd backend
npm run test
```

---

## 📋 FASE 1: Autenticación + Token

```bash
# Obtener token
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"

# Verificar que el token funciona
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/auth/me | jq '.'

# ✅ Esperado: Usuario actual con id, email, role
```

---

## 📸 FASE 2: Upload de Evidencias

### 2.1 Crear un archivo de prueba

```bash
# Crear PDF de prueba
cat > /tmp/evidence_test.txt << 'EOF'
Este es un documento de prueba para evidencia
Contiene información relevante de la actividad
Fecha: 2 de febrero de 2026
EOF

echo "Archivo creado: /tmp/evidence_test.txt"
```

### 2.2 Obtener IDs de Review y Activity

```bash
# Obtener una revisión existente
REVIEW=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/reviews \
  | jq '.data[0]')

REVIEW_ID=$(echo $REVIEW | jq -r '.id')
echo "Review ID: $REVIEW_ID"

# Obtener una actividad
ACTIVITY=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/agreement-activities \
  | jq '.data[0]')

ACTIVITY_ID=$(echo $ACTIVITY | jq -r '.id')
echo "Activity ID: $ACTIVITY_ID"
```

### 2.3 Upload de archivo

```bash
# Upload con Multer
curl -v -X POST http://localhost:4000/evidences/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/evidence_test.txt" \
  -F "reviewId=$REVIEW_ID" \
  -F "activityId=$ACTIVITY_ID" \
  -F "description=Prueba de evidencia Sprint 6"

# ✅ Esperado: Status 201 con Evidence object
# {
#   "id": "uuid-...",
#   "fileUrl": "/uploads/evidences/filename.txt",
#   "fileName": "evidence_test.txt",
#   "fileSize": "0.10 MB",
#   "documentType": "OTHER",
#   "description": "Prueba de evidencia Sprint 6",
#   "reviewId": "$REVIEW_ID",
#   "activityId": "$ACTIVITY_ID"
# }
```

---

## 📁 FASE 3: CRUD de Evidencias

### 3.1 Listar evidencias de un Review

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/evidences/by-review/$REVIEW_ID" | jq '.'

# ✅ Esperado: Array con evidencia que acabamos de subir
```

### 3.2 Listar evidencias de una Activity

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/evidences/by-activity/$ACTIVITY_ID" | jq '.'

# ✅ Esperado: Array con nuestra evidencia
```

### 3.3 Obtener evidencia específica

```bash
EVIDENCE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/evidences/by-review/$REVIEW_ID" \
  | jq -r '.[0].id')

echo "Evidence ID: $EVIDENCE_ID"

curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/evidences/$EVIDENCE_ID" | jq '.'

# ✅ Esperado: Objeto completo de la evidencia
```

### 3.4 Actualizar descripción

```bash
curl -s -X PATCH "http://localhost:4000/evidences/$EVIDENCE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Descripción actualizada"
  }' | jq '.'

# ✅ Esperado: Evidencia con descripción actualizada
```

### 3.5 Eliminar evidencia (soft delete)

```bash
curl -s -X DELETE "http://localhost:4000/evidences/$EVIDENCE_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ✅ Esperado: { "success": true, "message": "Evidencia eliminada" }

# Verificar que se hizo soft delete
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/evidences/by-review/$REVIEW_ID" | jq '.'

# ✅ Esperado: Array vacío (isActive=false)
```

---

## 🔒 FASE 4: Control de Edición

### 4.1 Intentar editar actividad (Review DRAFT)

```bash
# Crear nueva revisión en estado DRAFT
REVIEW_DRAFT=$(curl -s -X POST http://localhost:4000/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agreementId": "'$AGREEMENT_ID'",
    "poaPeriodId": "'$POA_PERIOD_ID'",
    "semester": 1,
    "year": 2026,
    "status": "DRAFT"
  }' | jq '.')

DRAFT_REVIEW_ID=$(echo $REVIEW_DRAFT | jq -r '.id')

# Editar actividad (debería funcionar)
curl -s -X PATCH "http://localhost:4000/agreement-activities/$ACTIVITY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}' | jq '.'

# ✅ Esperado: Actividad actualizada correctamente
```

### 4.2 Cerrar revisión

```bash
curl -s -X PATCH "http://localhost:4000/reviews/$DRAFT_REVIEW_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CLOSED"}' | jq '.'

# ✅ Esperado: Review con status="CLOSED"
```

### 4.3 Intentar editar actividad (Review CLOSED)

```bash
curl -s -X PATCH "http://localhost:4000/agreement-activities/$ACTIVITY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}'

# ❌ Esperado: 403 Forbidden
# {
#   "statusCode": 403,
#   "message": "No se puede editar. La revisión está en estado CLOSED. Debe reabrirse la revisión.",
#   "error": "Forbidden"
# }
```

### 4.4 Reabrir revisión

```bash
curl -s -X PATCH "http://localhost:4000/reviews/$DRAFT_REVIEW_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "REOPENED"}' | jq '.'

# ✅ Esperado: Review con status="REOPENED"
```

### 4.5 Intentar editar actividad (Review REOPENED)

```bash
curl -s -X PATCH "http://localhost:4000/agreement-activities/$ACTIVITY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"progress": 80}' | jq '.'

# ✅ Esperado: Actividad actualizada correctamente
```

---

## 📋 FASE 5: Auditoría

### 5.1 Ver historial de cambios de actividad

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/audits/entity/AGREEMENT_ACTIVITY/$ACTIVITY_ID" \
  | jq '.' | head -50

# ✅ Esperado: Array de audits con:
# - CREATE (cuando se creó la actividad)
# - UPDATE (cuando intentamos editar)
# - UPDATE (cuando reabrimos y editamos)
# Cada uno con oldData, newData, changes
```

### 5.2 Verificar cambios específicos

```bash
# Obtener primer UPDATE
AUDIT=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/audits/entity/AGREEMENT_ACTIVITY/$ACTIVITY_ID" \
  | jq '.[1]')

echo $AUDIT | jq '.changes'

# ✅ Esperado: Objeto mostrando qué cambió
# {
#   "progress": {
#     "old": 50,
#     "new": 75
#   }
# }
```

### 5.3 Ver estadísticas de auditoría

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/audits/stats" | jq '.'

# ✅ Esperado:
# {
#   "totalActions": 15,
#   "byAction": {
#     "create": 5,
#     "update": 8,
#     "delete": 2
#   },
#   "status": {
#     "success": 14,
#     "failure": 1
#   },
#   "successRate": "93.33%"
# }
```

### 5.4 Ver auditoría por usuario

```bash
USER_ID="<admin-user-id>"

curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/audits/user/$USER_ID" | jq '.' | head -30

# ✅ Esperado: Todas las acciones hechas por este usuario
```

---

## 🌐 FASE 6: Frontend Integration (Manual)

### 6.1 Acceder a Reviews

```
1. Ir a http://localhost:3000
2. Login: admin@example.com / admin123
3. Ir a "Reviews"
4. Seleccionar una revisión
5. En tabla → clickear en una actividad para editar
```

### 6.2 Probar upload de evidencia

```
1. Hacer scroll hasta sección "📎 Evidencias"
2. Arrastrar un PDF al área de upload O clickear para seleccionar
3. Agregar descripción opcional
4. Verificar que aparezca en lista inferior
```

### 6.3 Probar control de edición

```
1. Intentar cambiar un valor en la actividad
2. Si Review CLOSED → debe mostrar error
3. Si Review DRAFT/REOPENED → debe guardar
4. Verificar que aparezca en historial
```

### 6.4 Ver historial en UI

```
1. Hacer scroll a "📋 Historial de cambios"
2. Ver lista de cambios con timeline
3. Clickear en UPDATE para expandir
4. Ver comparación antes/después
```

---

## 📊 CHECKLIST DE TESTING

```
FASE 1: Autenticación
  ☑️ Token obtenido correctamente
  ☑️ Token funciona en peticiones autenticadas

FASE 2: Upload
  ☑️ Archivo se sube correctamente
  ☑️ Se retorna Evidence object
  ☑️ Se registra en BD

FASE 3: CRUD
  ☑️ Listar por Review
  ☑️ Listar por Activity
  ☑️ Obtener individual
  ☑️ Actualizar descripción
  ☑️ Soft delete

FASE 4: Edición Controlada
  ☑️ Editar cuando Review DRAFT ✅
  ☑️ Cerrar revisión
  ☑️ Intentar editar cuando CLOSED ❌ (403)
  ☑️ Reabrir revisión
  ☑️ Editar cuando REOPENED ✅

FASE 5: Auditoría
  ☑️ Historial de cambios capturado
  ☑️ Cambios mostrando antes/después
  ☑️ Estadísticas correctas
  ☑️ Auditoría por usuario

FASE 6: Frontend
  ☑️ Upload funciona en UI
  ☑️ Lista de evidencias carga
  ☑️ Historial visible
  ☑️ Error de edición mostrado
```

---

## 🐛 Troubleshooting

### Error 404 en upload
- ☑️ Verificar que carpeta `backend/uploads/evidences` existe
- ☑️ Crear si no existe: `mkdir -p backend/uploads/evidences`

### Token expirado
- ☑️ Obtener nuevo token del login

### Evidence no aparece en lista
- ☑️ Verificar reviewId y activityId son correctos
- ☑️ Verificar isActive=true en BD

### No se registra auditoría
- ☑️ Verificar que tabla `audits` existe
- ☑️ Verificar AuditsService está inyectado en AgreementActivitiesService

### Error 403 esperado pero no aparece
- ☑️ Verificar que Review está realmente en CLOSED
- ☑️ Verificar que canEditActivity() está siendo llamado

---

## 📈 Métricas de Éxito

✅ **Todos los tests pasaron:** Sprint 6+7 listo para QA  
✅ **Cobertura:** 100% de endpoints  
✅ **Auditoría:** Completa y verificable  
✅ **Control:** Funcionando correctamente  

**Tiempo aproximado:** 30-45 minutos  
**Requiere:** Postman/curl + navegador

---

**Status:** ✅ LISTO PARA TESTING  
**Próximo:** QA User Validation
