# 📋 Guía de Pruebas - Sprint 2

## 🚀 Quick Start

### 1. **Iniciar Backend**
```bash
cd backend
npm run start:dev
```

**Esperado**: 
- Servidor en `http://localhost:4000`
- TypeORM sincroniza BD con nuevas entidades
- Swagger disponible en `http://localhost:4000/api/docs`

### 2. **Iniciar Frontend**
```bash
cd frontend
npm run dev
```

**Esperado**:
- Aplicación en `http://localhost:3000`
- Si puerto 3000 está en uso, intenta 3001, 3002, etc.

### 3. **Verificar Base de Datos**
```bash
# Conectar a PostgreSQL
psql -h localhost -p 5434 -U poauser -d poa_tracker

# Ver tablas creadas
\dt

# Verificar estructura
\d municipalities
\d agreements
\d poa_periods
```

---

## 🧪 Flujo de Prueba Completo

### **Parte 1: Autenticación**

1. **Registrarse como ADMIN**
   - Ir a `http://localhost:3000/register`
   - Llenar formulario:
     - Nombre: Admin
     - Apellido: User
     - Email: admin@poa.local
     - Rol: **Administrador** (ADMIN)
     - Contraseña: Pass123456

2. **Registrarse como COORDINATOR**
   - Nombre: Juan
   - Apellido: Coordinator
   - Email: coordinator@poa.local
   - Rol: **Coordinador** (COORDINATOR)
   - Contraseña: Pass123456

3. **Registrarse como SUPERVISOR_POA**
   - Nombre: Pedro
   - Apellido: Supervisor
   - Email: supervisor@poa.local
   - Rol: **Supervisor POA** (SUPERVISOR_POA)
   - Contraseña: Pass123456

4. **Admin aprueba usuarios**
   - Login como admin@poa.local / Pass123456
   - Ir a `/admin`
   - Ver 3 usuarios pendientes
   - Aprobar los 3 usuarios
   - Logout

---

### **Parte 2: Municipios**

**Como ADMIN**, ir a `/municipalities`

#### Test 2.1: Crear Municipios
1. Click "+ Crear Municipio"
2. Ingresa:
   - Código: `05001`
   - Nombre: `Medellín`
   - Departamento: `Antioquia`
3. Click Guardar
4. ✓ Verificar que aparece en tabla
5. Repetir con:
   - `68001`, `Cartagena`, `Bolívar`
   - `76001`, `Cali`, `Valle del Cauca`

#### Test 2.2: Búsqueda y Filtros
1. Escribir en búsqueda: "Medellín"
   - ✓ Debe filtrar por nombre
2. Escribir: "05001"
   - ✓ Debe filtrar por código DANE
3. Seleccionar departamento: "Antioquia"
   - ✓ Debe mostrar solo municipios de Antioquia
4. Combinar filtros
   - ✓ Debe funcionar en conjunto

#### Test 2.3: Paginación
1. Si hay más de 10 municipios, debe haber botón "Siguiente"
2. Click "Siguiente"
   - ✓ Debe ir a página 2
3. Click "Anterior"
   - ✓ Debe volver a página 1

#### Test 2.4: Listar Departamentos
- En filtro de departamentos debe haber lista de todos los departamentos únicos

---

### **Parte 3: Convenios**

**Como COORDINATOR**, ir a `/agreements`

#### Test 3.1: Crear Convenios
1. Click "+ Crear Convenio"
2. Ingresa:
   - Número: `AGR-2024-001`
   - Municipio: `Medellín`
   - Fecha inicio: `2024-01-01`
   - Fecha vencimiento: `2024-12-31`
   - Descripción: "Convenio Marco 2024"
3. Click Guardar
   - ✓ Debe crearse exitosamente
   - ✓ Debe aparecer en tabla

4. Repetir con:
   - `AGR-2024-002`, Cartagena, 2024-01-01 - 2024-12-31
   - `AGR-2025-001`, Cali, 2025-01-01 - 2025-12-31

#### Test 3.2: Validaciones
1. Intentar crear con:
   - Número duplicado (AGR-2024-001 nuevamente)
     - ✓ Debe mostrar error: "Convenio con número ... ya existe"
   - Fecha inicio >= fecha fin
     - ✓ Debe mostrar error en validación local

#### Test 3.3: Filtros
1. Filtro por municipio: Selecciona "Medellín"
   - ✓ Debe mostrar solo convenios de Medellín
2. Filtro por departamento: Selecciona "Bolívar"
   - ✓ Debe mostrar solo convenios de Bolívar
3. Filtro por estado: Selecciona "ACTIVE"
   - ✓ Todos deben tener badge verde

#### Test 3.4: Navegación a Vigencias
1. Click en "Ver Vigencias" de un convenio
   - ✓ Debe ir a `/agreements/[id]`
   - ✓ Debe mostrar detalles del convenio
   - ✓ Debe mostrar tabla de vigencias POA

---

### **Parte 4: Vigencias POA**

**En `/agreements/[id]`**

#### Test 4.1: Ver Vigencias Creadas
1. El sistema debería haber creado automáticamente vigencias para 2024 y 2025
   - ✓ Verificar tabla con dos filas (año 2024, año 2025)
   - ✓ Estado: DRAFT
   - ✓ Sin supervisor asignado

#### Test 4.2: Crear Vigencia Manual
1. **Como ADMIN o COORDINATOR**, click "+ Crear Vigencia"
2. Ingresa año: `2026`
3. Click Crear
   - ✓ Debe aparecer nueva fila en tabla
   - ✓ Estado: DRAFT
   - ✓ Sin supervisor

#### Test 4.3: Validación de Año Duplicado
1. Intentar crear vigencia para año 2024 nuevamente
   - ✓ Debe mostrar error: "Ya existe un POA para el año 2024..."

#### Test 4.4: Asignar Supervisor
1. Panel "Asignar Supervisor":
   - Selecciona vigencia: `POA 2024`
   - Selecciona supervisor: `Pedro Supervisor`
   - Click Asignar
2. ✓ La fila de 2024 debe mostrar:
   - Nombre: Pedro Supervisor
   - Email: supervisor@poa.local
3. Repetir con:
   - POA 2025 → Pedro Supervisor

#### Test 4.5: Control de Acceso
1. Logout → Login como `supervisor@poa.local`
2. Ir a `/admin`
   - ✓ Debe mostrar mensaje de acceso denegado o error
3. Ir a `/municipalities`
   - ✓ Debe poder ver municipios (AUTHENTICATED)
4. Ir a `/agreements`
   - ✓ Debe poder ver convenios
5. Click "Ver Vigencias"
   - ✓ Debe poder ver vigencias donde es supervisor

---

### **Parte 5: Endpoints API (Swagger)**

Ir a `http://localhost:4000/api/docs`

#### Test 5.1: Municipalities
1. **POST /municipalities**
   ```json
   {
     "code": "05002",
     "name": "Itagüí",
     "department": "Antioquia"
   }
   ```
   - ✓ Response 201 con municipio creado

2. **GET /municipalities**
   - ✓ Response 200 con array de municipios
   - ✓ Incluir query params: `?search=Medellín&page=1&limit=10`

3. **GET /municipalities/departments**
   - ✓ Response array de strings con departamentos únicos

4. **GET /municipalities/{id}**
   - ✓ Response 200 con detalle de municipio

#### Test 5.2: Agreements
1. **POST /agreements**
   ```json
   {
     "agreementNumber": "AGR-2024-003",
     "startDate": "2024-01-01",
     "endDate": "2024-12-31",
     "status": "ACTIVE",
     "municipalityId": "[UUID]",
     "description": "Test"
   }
   ```
   - ✓ Response 201 con convenio

2. **GET /agreements?municipalityId=...&status=ACTIVE**
   - ✓ Response con convenios filtrados

3. **GET /agreements/{id}**
   - ✓ Incluye municipio y poaPeriods

#### Test 5.3: POA Periods
1. **POST /poa-periods**
   ```json
   {
     "year": 2027,
     "agreementId": "[UUID]"
   }
   ```
   - ✓ Response 201

2. **GET /poa-periods/agreement/{agreementId}**
   - ✓ Response array de vigencias del convenio

3. **PATCH /poa-periods/{id}/assign-supervisor**
   ```json
   {
     "supervisorId": "[UUID]"
   }
   ```
   - ✓ Response 200 con supervisor asignado

---

## 🔍 Verificaciones de BD

### Consultas SQL para verificar datos

```sql
-- Ver municipios creados
SELECT id, code, name, department FROM municipalities;

-- Ver convenios con municipio
SELECT a.id, a.agreement_number, m.name, a.status 
FROM agreements a 
JOIN municipalities m ON a.municipality_id = m.id;

-- Ver vigencias POA
SELECT p.id, p.year, a.agreement_number, p.status, p.supervisor_id 
FROM poa_periods p 
JOIN agreements a ON p.agreement_id = a.id;

-- Ver supervisores en vigencias
SELECT 
  p.year, 
  a.agreement_number, 
  u.first_name, 
  u.email
FROM poa_periods p
JOIN agreements a ON p.agreement_id = a.id
LEFT JOIN "user" u ON p.supervisor_id = u.id;
```

---

## 🐛 Debugging

### Backend - Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `BadRequestException: Municipio con código ... ya existe` | Intento de DANE duplicado | Usar código DANE único |
| `BadRequestException: La fecha de inicio debe ser anterior...` | startDate >= endDate | Asegurar startDate < endDate |
| `ForbiddenException` | Usuario sin rol requerido | Asegurar que usuario fue aprobado |
| `TypeOrmQueryError: foreign key constraint` | ID de municipio no existe | Verificar que municipio existe primero |

### Frontend - Errores Comunes

| Síntoma | Causa | Solución |
|--------|-------|----------|
| Página en blanco en `/municipalities` | No está autenticado | Hacer login primero |
| No aparecen datos en selectores | API retorna vacío | Crear municipios/supervisores primero |
| Error 401 en API | Cookie no se envía | Verificar `withCredentials: true` en apiClient |
| Paginación no funciona | Limit/page incorrectos | Verificar parámetros en query string |

---

## ✅ Checklist de Aceptación

- [ ] Crear municipio exitosamente
- [ ] Listar municipios con paginación
- [ ] Filtros de búsqueda funcionan
- [ ] Crear convenio exitosamente
- [ ] Ver convenios de municipio
- [ ] Crear vigencia POA
- [ ] Asignar supervisor a vigencia
- [ ] Control de acceso por rol funciona
- [ ] BD tiene datos correctos
- [ ] Swagger documenta todos endpoints
- [ ] Frontend muestra datos en tiempo real
- [ ] Validaciones previenen datos inválidos

---

## 📞 Endpoints Rápidos para Testing

```bash
# Listar municipios
curl http://localhost:4000/municipalities \
  -H "Authorization: Bearer [TOKEN]"

# Crear municipio
curl -X POST http://localhost:4000/municipalities \
  -H "Content-Type: application/json" \
  -d '{"code":"05001","name":"Medellín","department":"Antioquia"}' \
  -H "Authorization: Bearer [TOKEN]"

# Listar convenios
curl http://localhost:4000/agreements \
  -H "Authorization: Bearer [TOKEN]"

# Listar POA Periods
curl http://localhost:4000/poa-periods \
  -H "Authorization: Bearer [TOKEN]"
```

---

## 🎯 Resultado Esperado

Al completar todas las pruebas:

1. ✓ Sistema de municipios funcional
2. ✓ Sistema de convenios funcional
3. ✓ Sistema de vigencias POA funcional
4. ✓ Asignación de supervisores funcional
5. ✓ Control de acceso basado en roles
6. ✓ Frontend reflejando todos los cambios
7. ✓ BD con estructura correcta y relaciones establecidas

**Sprint 2 lista para Demostración** 🚀
