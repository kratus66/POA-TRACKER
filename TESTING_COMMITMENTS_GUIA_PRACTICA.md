# 🧪 Guía Práctica: Testing del Módulo Commitments

**Puerto**: 3333  
**Autenticación**: JWT via Cookie  
**Usuario Test**: admin@example.com / admin123

---

## 🚀 Paso 1: Iniciar el Backend

```bash
cd backend
PORT=3333 nohup node dist/main.js > /tmp/backend.log 2>&1 &
```

Verificar que está corriendo:
```bash
curl -s http://localhost:3333/health
# Respuesta esperada: {"status":"OK",...}
```

---

## 🔑 Paso 2: Obtener Token JWT

```bash
TOKEN=$(curl -s -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | \
  sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

echo "Token: $TOKEN"
```

---

## 📝 Paso 3: Crear Datos de Prueba

Antes de probar commitments, necesitas:
1. Un ReviewCycle abierto
2. Una AgreementActivity con status NO_CUMPLIDA

### 3.1 Obtener IDs Necesarios

```bash
# Obtener ReviewCycle ID
REVIEW_ID=$(curl -s "http://localhost:3333/poa-periods" \
  -H "Cookie: access_token=$TOKEN" | \
  sed -n 's/.*"id":"\([^"]*\)".*/\1/p' | head -1)

echo "Review ID: $REVIEW_ID"

# Obtener AgreementActivity ID
ACTIVITY_ID=$(curl -s "http://localhost:3333/agreement-activities" \
  -H "Cookie: access_token=$TOKEN" | \
  sed -n 's/.*"id":"\([^"]*\)".*/\1/p' | head -1)

echo "Activity ID: $ACTIVITY_ID"
```

Si no existen datos, necesitarás crear primero algunos períodos y actividades en la base de datos.

---

## ✅ Paso 4: Testing de Endpoints

### Test 4.1: Listar Commitments (vacío esperado)

```bash
curl -s http://localhost:3333/commitments \
  -H "Cookie: access_token=$TOKEN" | \
  python3 -m json.tool
```

**Respuesta esperada**:
```json
[]
```

---

### Test 4.2: Crear Commitment ⭐

```bash
# Asegúrate de tener REVIEW_ID y ACTIVITY_ID establecidos
COMMITMENT=$(curl -s -X POST http://localhost:3333/commitments \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=$TOKEN" \
  -d '{
    "description": "Completar análisis de implementación de política pública",
    "dueDate": "2026-03-31",
    "responsibleRole": "REGIONAL_MANAGER",
    "reviewCycleId": "'$REVIEW_ID'",
    "agreementActivityId": "'$ACTIVITY_ID'"
  }')

echo "$COMMITMENT" | python3 -m json.tool

# Guardar el ID para pruebas posteriores
COMMITMENT_ID=$(echo "$COMMITMENT" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
echo "Commitment creado: $COMMITMENT_ID"
```

**Respuesta esperada**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Completar análisis de implementación de política pública",
  "dueDate": "2026-03-31",
  "responsibleRole": "REGIONAL_MANAGER",
  "status": "OPEN",
  "reviewCycleId": "xxx-xxx",
  "agreementActivityId": "yyy-yyy",
  "createdAt": "2026-02-03T15:00:00.000Z",
  "updatedAt": "2026-02-03T15:00:00.000Z"
}
```

---

### Test 4.3: Obtener Commitment por ID

```bash
curl -s "http://localhost:3333/commitments/$COMMITMENT_ID" \
  -H "Cookie: access_token=$TOKEN" | \
  python3 -m json.tool
```

**Respuesta esperada**: Mismo objeto que se creó, con relaciones cargadas

---

### Test 4.4: Listar Compromisos Abiertos

```bash
curl -s "http://localhost:3333/commitments/open" \
  -H "Cookie: access_token=$TOKEN" | \
  python3 -m json.tool
```

**Respuesta esperada**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "OPEN",
    ...
  }
]
```

---

### Test 4.5: Cerrar Commitment ⭐⭐

```bash
curl -s -X PATCH "http://localhost:3333/commitments/$COMMITMENT_ID/close" \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=$TOKEN" \
  -d '{
    "closureNotes": "Se completó el análisis exitosamente. El documento fue entregado a dirección."
  }' | \
  python3 -m json.tool
```

**Respuesta esperada**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "CLOSED",
  "closedAt": "2026-02-03T15:05:30.000Z",
  "closureNotes": "Se completó el análisis exitosamente. El documento fue entregado a dirección.",
  ...
}
```

---

### Test 4.6: Verificar Que está Cerrado

```bash
curl -s "http://localhost:3333/commitments/$COMMITMENT_ID" \
  -H "Cookie: access_token=$TOKEN" | \
  python3 -m json.tool | grep -A2 '"status"'
```

**Respuesta esperada**:
```
"status": "CLOSED"
```

---

### Test 4.7: Listar Compromisos Anteriores

```bash
curl -s "http://localhost:3333/commitments/previous?agreementActivityId=$ACTIVITY_ID" \
  -H "Cookie: access_token=$TOKEN" | \
  python3 -m json.tool
```

**Respuesta esperada**: Array con el commitment cerrado

---

## 🔍 Paso 5: Testing de Filtros

### Filtrar por Status

```bash
# Solo abiertos
curl -s "http://localhost:3333/commitments?status=OPEN" \
  -H "Cookie: access_token=$TOKEN"

# Solo cerrados
curl -s "http://localhost:3333/commitments?status=CLOSED" \
  -H "Cookie: access_token=$TOKEN"
```

---

### Filtrar por ReviewCycle

```bash
curl -s "http://localhost:3333/commitments?reviewCycleId=$REVIEW_ID" \
  -H "Cookie: access_token=$TOKEN"
```

---

### Filtrar por Activity

```bash
curl -s "http://localhost:3333/commitments?agreementActivityId=$ACTIVITY_ID" \
  -H "Cookie: access_token=$TOKEN"
```

---

## 🚫 Paso 6: Testing de Validaciones y Errores

### Error: Review Cerrada

Si intentas crear un commitment con un reviewCycleId cerrado:

```bash
# (Previamente cierra la review)
curl -s -X POST http://localhost:3333/commitments \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=$TOKEN" \
  -d '{
    "description": "Test",
    "dueDate": "2026-03-31",
    "responsibleRole": "REGIONAL_MANAGER",
    "reviewCycleId": "'$CLOSED_REVIEW_ID'",
    "agreementActivityId": "'$ACTIVITY_ID'"
  }'
```

**Respuesta esperada**: 400 Bad Request
```json
{
  "message": "La revisión está cerrada",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### Error: Activity No Encontrada

```bash
curl -s -X POST http://localhost:3333/commitments \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=$TOKEN" \
  -d '{
    "description": "Test",
    "dueDate": "2026-03-31",
    "responsibleRole": "REGIONAL_MANAGER",
    "reviewCycleId": "'$REVIEW_ID'",
    "agreementActivityId": "invalid-id-12345"
  }'
```

**Respuesta esperada**: 404 Not Found
```json
{
  "message": "Actividad no encontrada",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### Error: Sin Autenticación

```bash
curl -s http://localhost:3333/commitments
```

**Respuesta esperada**: 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

### Error: Role Insuficiente

Si intenta con un usuario que no es COORDINATOR ni ADMIN:

```bash
# Intenta cerrar con un usuario SUPERVISOR_POA
curl -s -X PATCH "http://localhost:3333/commitments/$COMMITMENT_ID/close" \
  -H "Cookie: access_token=$SUPERVISOR_TOKEN" \
  -d '{}'
```

**Respuesta esperada**: 403 Forbidden
```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

## 📊 Paso 7: Verificación de Base de Datos

### Ver registros directamente

```bash
# En el shell de PostgreSQL
psql -U postgres -d poa_tracker -c "SELECT id, description, status, dueDate, closedAt FROM commitments;"
```

**Respuesta esperada**:
```
                   id                  |              description              | status | dueDate   | closedAt
--------------------------------------+----------------------------------------+--------+-----------+-----------
 550e8400-e29b-41d4-a716-446655440000 | Completar análisis...                 | CLOSED | 2026-03-31| 2026-02-03
```

---

## 🎯 Checklist de Testing Completo

- [ ] Health check responde
- [ ] Login obtiene token válido
- [ ] GET /commitments lista vacía (sin datos)
- [ ] POST /commitments crea commitment exitosamente
- [ ] GET /commitments/:id obtiene el commitment creado
- [ ] GET /commitments/open lista commitments abiertos
- [ ] PATCH /commitments/:id/close cierra el commitment
- [ ] Status cambió a CLOSED después de cerrar
- [ ] closedAt se estableció con la fecha/hora actual
- [ ] closureNotes se guardó
- [ ] GET /commitments/previous retorna el commitment cerrado
- [ ] Filtros por status funcionan
- [ ] Filtros por reviewCycleId funcionan
- [ ] Filtros por agreementActivityId funcionan
- [ ] Validación: Review cerrada rechaza nuevo commitment
- [ ] Validación: Activity no encontrada retorna 404
- [ ] Validación: Sin autenticación retorna 401
- [ ] Base de datos tiene registros correctos

---

## 🐛 Troubleshooting

### Puerto 3333 ya está en uso

```bash
# Matar procesos anteriores
pkill -9 -f "node dist/main.js"

# Reintentar con diferente puerto
PORT=3334 node dist/main.js
```

---

### Token inválido o expirado

```bash
# Obtener nuevo token
TOKEN=$(curl -s -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | \
  sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
```

---

### No aparecen datos en las respuestas

Verifica que existan datos en la base de datos:
```bash
psql -U postgres -d poa_tracker -c "SELECT COUNT(*) FROM poa_periods; SELECT COUNT(*) FROM agreement_activities;"
```

Si está vacío, crea datos de prueba primero.

---

## 📞 Contacto y Documentación

Para más detalles, ver:
- [PRUEBA_FLUJO_COMMITMENTS.md](./PRUEBA_FLUJO_COMMITMENTS.md) - Documentación arquitectónica
- `backend/src/commitments/commitments.service.ts` - Lógica de negocio
- `backend/src/commitments/commitments.controller.ts` - Endpoints
- `backend/src/commitments/entities/commitment.entity.ts` - Esquema de BD
