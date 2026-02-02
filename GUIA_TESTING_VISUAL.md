# 🎬 GUÍA VISUAL - TESTING DEL FLUJO COMPLETO

## 📍 UBICACIÓN DE ARCHIVOS

### Archivos principales del frontend:
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx               ← Dashboard
│   │   ├── agreements/[id]/page.tsx  ← Convenios (detalle)
│   │   ├── reports/page.tsx       ← Reportes y gráficos
│   │   ├── reviews/page.tsx       ← Revisiones/Validaciones
│   │   ├── municipalities/page.tsx ← Municipios
│   │   ├── programs/page.tsx      ← Programas
│   │   ├── poa-templates/page.tsx ← Plantillas POA
│   │   ├── activity-tracking/page.tsx ← Seguimiento
│   │   └── login/page.tsx         ← Autenticación
│   │
│   └── components/
│       ├── EvidenceUpload.tsx     ← Componente subir archivos
│       ├── EvidencesList.tsx      ← Componente listar evidencias
│       ├── AuditHistory.tsx       ← Componente auditoría
│       └── EditableTable.tsx      ← Tabla editable genérica
```

---

## 🔧 CHECKLIST DE TESTING

### ✅ **PASO 0: Verificación del Ambiente**

```bash
# Terminal 1: Backend
cd backend
npm run start:dev
# Esperar: ✅ Listening on port 4000

# Terminal 2: Docker
docker ps
# Debería ver:
# - poa-tracker-db (PostgreSQL en 5434)
# - poa-tracker-pgadmin (pgAdmin en 5051)

# Terminal 3: Frontend
cd frontend
npm run dev
# Esperar: ✅ Compiled successfully
# Acceder a: http://localhost:3000
```

**Validaciones:**
- ✅ Backend running en http://localhost:4000
- ✅ Frontend running en http://localhost:3000
- ✅ Docker containers activos
- ✅ Sin errores en consola

---

### ✅ **PASO 1: AUTENTICACIÓN (Login)**

**URL:** `http://localhost:3000/login`

**Credenciales de prueba:**
```javascript
Rol: ADMIN
Email: admin@example.com
Password: admin123

Rol: SUPERVISOR
Email: supervisor@example.com
Password: supervisor123

Rol: ENCARGADO
Email: encargado@example.com
Password: encargado123
```

**Acciones a probar:**

1. **Login exitoso ADMIN**
   ```
   1. Ir a http://localhost:3000/login
   2. Ingresa email: admin@example.com
   3. Ingresa password: admin123
   4. Click "Ingresar"
   5. ✅ Debería redirigir a Dashboard
   6. ✅ Token JWT guardado en localStorage
   ```

   **Validar:**
   - ✅ Página redirecciona a / (Dashboard)
   - ✅ Header muestra "Bienvenido Admin"
   - ✅ Menú lateral muestra todos los módulos
   - ✅ Token en `localStorage.getItem('access_token')` no es vacío

2. **Login inválido**
   ```
   1. Email: admin@example.com
   2. Password: wrongpassword
   3. Click "Ingresar"
   4. ✅ Error: "Credenciales inválidas"
   5. ✅ No redirecciona
   ```

3. **Logout**
   ```
   1. Click ícono usuario arriba derecha
   2. Click "Cerrar sesión"
   3. ✅ Redirecciona a /login
   4. ✅ localStorage limpiado
   ```

---

### ✅ **PASO 2: DASHBOARD (Inicio)**

**URL:** `http://localhost:3000/`

**Acciones a probar:**

1. **Verificar componentes**
   ```
   ✅ Título: "Bienvenido a POA Tracker"
   ✅ Subtítulo: "Sistema de seguimiento..."
   ✅ 4 tarjetas de estadísticas:
      - Total POAs: 0 (inicialmente vacío)
      - Completados: 0
      - En Revisión: 0
      - Por Completar: 0
   ✅ Menú lateral con 9 opciones
   ✅ Usuario y rol mostrado en header
   ```

2. **Navegación desde Dashboard**
   ```
   Click en cada módulo del menú:
   - Dashboard → Permanece en dashboard
   - POAs → Va a /poas (vacío inicialmente)
   - Actividades → Va a /activities (vacío inicialmente)
   - Reportes → Va a /reports (sin datos)
   - Municipios → Va a /municipalities (cargados del seeder)
   - Convenios → Va a /agreements (vacío inicialmente)
   - Programas → Va a /programs (cargados del seeder)
   - Plantillas POA → Va a /poa-templates (vacío inicialmente)
   - Seguimiento → Va a /activity-tracking (vacío inicialmente)
   ```

---

### ✅ **PASO 3: MUNICIPIOS (Explorar)**

**URL:** `http://localhost:3000/municipalities`

**Estado esperado:** 
- 33 departamentos precargados
- 252 municipios precargados (del seeder)

**Acciones a probar:**

1. **Ver lista de municipios**
   ```
   1. Ir a MUNICIPIOS
   2. ✅ Debería cargar tabla con municipios
   3. ✅ Columnas visibles:
      - Nombre del municipio
      - Departamento
      - Código
      - Población (si existe)
   ```

2. **Filtrar por departamento**
   ```
   1. Buscar dropdown/filtro de departamentos
   2. Seleccionar un departamento (ej: La Paz)
   3. ✅ Tabla filtra mostrando solo municipios de La Paz
   4. ✅ Debería haber al menos 10 municipios
   ```

3. **Búsqueda**
   ```
   1. Escribir en campo de búsqueda: "La Paz"
   2. ✅ Filtra municipios con "La Paz" en el nombre
   3. ✅ Resultados se actualizan en tiempo real
   ```

---

### ✅ **PASO 4: PROGRAMAS (Explorar)**

**URL:** `http://localhost:3000/programs`

**Estado esperado:**
- Programas precargados del seeder

**Acciones a probar:**

1. **Ver lista de programas**
   ```
   1. Ir a PROGRAMAS
   2. ✅ Debería mostrar tabla de programas
   3. ✅ Columnas:
      - Nombre del programa
      - Descripción
      - Departamento responsable
      - Estado
   ```

2. **Detalles de programa**
   ```
   1. Click en un programa
   2. ✅ Muestra detalles completos
   3. ✅ Muestra actividades asociadas
   4. ✅ Muestra municipios relacionados
   ```

---

### ✅ **PASO 5: CREAR CONVENIO**

**URL:** `http://localhost:3000/agreements`

**Acciones a probar:**

1. **Crear nuevo convenio**
   ```
   1. Ir a CONVENIOS
   2. Click botón "Crear Convenio" o "+"
   3. Formulario aparece con campos:
      ✅ Municipio (dropdown - seleccionar La Paz)
      ✅ Código (ej: CONV-2024-001)
      ✅ Descripción (ej: Capacitación educativa)
      ✅ Programa (dropdown - seleccionar uno)
      ✅ Fecha inicio (date picker)
      ✅ Fecha fin (date picker)
      ✅ Observaciones (opcional)
   
   4. Llenar ejemplo:
      - Municipio: La Paz
      - Código: CONV-TEST-001
      - Descripción: Prueba de sistema
      - Programa: (elegir cualquiera)
      - Fecha: 01/01/2024 - 31/12/2024
   
   5. Click "Guardar"
   6. ✅ Convenio aparece en lista
   7. ✅ Status inicial: "ABIERTO"
   8. ✅ Auditoría registra: CREATE por admin
   ```

2. **Verificar convenio creado**
   ```
   1. Convenio debe aparecer en la tabla
   2. Columnas mostradas:
      ✅ Código
      ✅ Municipio
      ✅ Estado (ABIERTO)
      ✅ Fecha
      ✅ Acciones (Ver, Editar, Eliminar)
   ```

---

### ✅ **PASO 6: AGREGAR ACTIVIDADES AL CONVENIO**

**URL:** `http://localhost:3000/agreements/[id]`

**Acciones a probar:**

1. **Abrir convenio creado**
   ```
   1. Click en el convenio CONV-TEST-001
   2. ✅ Abre página de detalles
   3. ✅ Muestra información del convenio
   4. ✅ Botones: Editar, Cerrar, Reabrir (si está cerrado)
   ```

2. **Agregar actividad**
   ```
   1. Ir a sección "Actividades"
   2. Click "Agregar Actividad" o "+"
   3. Formulario con campos:
      ✅ Actividad (buscar/dropdown)
      ✅ Meta cuantitativa (número)
      ✅ Unidad de medida (texto)
      ✅ Responsable (usuario)
      ✅ Descripción (opcional)
   
   4. Llenar ejemplo:
      - Actividad: (seleccionar una disponible)
      - Meta: 100
      - Unidad: personas
      - Responsable: supervisor@example.com
      - Descripción: Primera actividad de prueba
   
   5. Click "Guardar"
   6. ✅ Actividad aparece en tabla bajo el convenio
   7. ✅ Se registra en auditoría
   ```

3. **Ver actividades agregadas**
   ```
   1. Tabla muestra actividades con:
      ✅ Descripción
      ✅ Meta
      ✅ Unidad
      ✅ Responsable
      ✅ Estado (PENDIENTE inicialmente)
      ✅ Botones: Ver Evidencias, Editar, Eliminar
   ```

---

### ✅ **PASO 7: SUBIR EVIDENCIAS**

**URL:** `http://localhost:3000/agreements/[id]`

**Componentes:** `EvidenceUpload.tsx` y `EvidencesList.tsx`

**Acciones a probar:**

1. **Abrir sección de evidencias**
   ```
   1. En la actividad creada, click "Ver Evidencias"
   2. ✅ Muestra sección de evidencias
   3. ✅ Área de "Drag & Drop" o botón "Seleccionar archivo"
   ```

2. **Subir archivo mediante Drag & Drop**
   ```
   1. Arrastra un archivo (PDF, IMG, WORD, EXCEL) al área
   2. ✅ Se detecta el tipo automáticamente:
      - PDF → DocumentType.PDF
      - Image (jpg, png) → DocumentType.IMAGE
      - Excel → DocumentType.EXCEL
      - Word → DocumentType.WORD
   3. ✅ Muestra vista previa del archivo
   4. ✅ Campo "Descripción" aparece
   5. Llenar: "Comprobante de asistencia"
   6. Click "Subir" o "Upload"
   7. ✅ Archivo se sube
   8. ✅ Progreso mostrado
   9. ✅ Archivo aparece en lista de evidencias
   ```

3. **Subir archivo mediante botón**
   ```
   1. Click "Seleccionar archivo"
   2. Explorador de archivos abierto
   3. Seleccionar archivo de prueba
   4. ✅ Mismo flujo que drag & drop
   5. ✅ Archivo cargado exitosamente
   ```

4. **Verificar lista de evidencias**
   ```
   Cada evidencia muestra:
   ✅ Nombre del archivo
   ✅ Tipo de documento (PDF, IMG, etc.)
   ✅ Tamaño del archivo
   ✅ Fecha de carga
   ✅ Usuario que cargó
   ✅ Descripción
   ✅ Botones: Descargar, Editar, Eliminar
   ```

5. **Probar múltiples tipos de archivos**
   ```
   Subir al menos:
   ✅ 1 PDF
   ✅ 1 Imagen (JPG/PNG)
   ✅ 1 Excel (XLSX)
   ✅ 1 Word (DOCX)
   
   Validar en cada caso:
   - DocumentType correcto
   - Archivo visible en lista
   - Auditoría registra UPLOAD_EVIDENCE
   ```

---

### ✅ **PASO 8: VER AUDITORÍA (Historial)**

**URL:** `http://localhost:3000/agreements/[id]`

**Componente:** `AuditHistory.tsx`

**Acciones a probar:**

1. **Abrir sección de auditoría**
   ```
   1. En el convenio, scroll a "Auditoría" o pestaña
   2. ✅ Muestra timeline de cambios
   ```

2. **Verificar eventos registrados**
   ```
   Debería ver timeline con:
   ✅ CREATE - Creación del convenio
      └─ Usuario: admin@example.com
      └─ Hora: timestamp
      └─ Datos: información inicial
   
   ✅ UPDATE - Actualizaciones al convenio
      └─ Usuario: quien editó
      └─ Cambios: qué cambió (antes/después)
   
   ✅ CREATE/UPDATE - Actividades agregadas
      └─ Mismos detalles
   
   ✅ UPLOAD_EVIDENCE - Archivos subidos
      └─ Usuario: quien subió
      └─ Archivo: nombre
      └─ Descripción: lo que ingresó
   ```

3. **Expandir detalles**
   ```
   1. Click en un evento
   2. ✅ Muestra detalles completos
   3. ✅ Datos anteriores vs nuevos (si es UPDATE)
   4. ✅ Razón/Observación si existe
   ```

---

### ✅ **PASO 9: CERRAR CONVENIO**

**URL:** `http://localhost:3000/agreements/[id]`

**Acciones a probar:**

1. **Cerrar convenio**
   ```
   1. Click botón "Cerrar Convenio"
   2. Confirmación: "¿Está seguro? No podrá editar después"
   3. Click "Confirmar"
   4. ✅ Estado cambia: ABIERTO → CERRADO
   5. ✅ Auditoría registra: CLOSE por admin
   6. ✅ Todos los botones de edición se desactivan
   ```

2. **Verificar que no se puede editar**
   ```
   1. Intentar editar actividad
   2. ✅ Botón "Editar" deshabilitado o gris
   3. ✅ Mensaje: "Convenio cerrado. Reabrir para editar"
   4. Intentar editar información
   5. ✅ Campos de entrada deshabilitados
   ```

3. **Reabrir convenio**
   ```
   1. Click botón "Reabrir Convenio"
   2. ✅ Estado cambia: CERRADO → ABIERTO
   3. ✅ Auditoría registra: REOPEN
   4. ✅ Botones de edición habilitados nuevamente
   ```

---

### ✅ **PASO 10: CREAR REVISIÓN (Validación)**

**URL:** `http://localhost:3000/reviews`

**Acciones a probar:**

1. **Acceder a revisiones**
   ```
   1. Click en menú lateral: "Reportes" o módulo de Revisiones
   2. ✅ Página de revisiones carga
   3. ✅ Filtros disponibles:
      - Semestre (1 o 2)
      - Año (selector de año)
      - Municipio (opcional)
   ```

2. **Crear nueva revisión**
   ```
   1. Click "Crear Revisión" o "Nueva Validación"
   2. Seleccionar:
      - Semestre: 1
      - Año: 2024
      - Municipio: La Paz (donde creamos convenio)
   3. Click "Crear"
   4. ✅ Muestra actividades del periodo
   ```

3. **Validar actividades**
   ```
   Para cada actividad mostrada:
   
   1. Actividad 1 de nuestro convenio
   2. Selector de estado:
      - ✅ CUMPLE (verde)
      - ❌ NO_CUMPLE (rojo)
      - ⊘ NO_APLICA (gris)
      - ⏳ PENDIENTE (amarillo)
   
   3. Seleccionar: CUMPLE
   4. Campo "Observaciones":
      - Escribir: "Actividad completada con éxito. Evidencias en expediente."
   5. Campo "Valor cuantitativo":
      - Escribir: 100 (coincide con meta)
   6. Click "Guardar"
   7. ✅ Cambios guardados
   8. ✅ Auditoría actualizada
   ```

4. **Completar revisión**
   ```
   1. Validar todas las actividades del período
   2. Click "Completar Revisión" o "Finalizar"
   3. Confirmación
   4. ✅ Revisión se cierra (estado: CLOSED)
   5. ✅ No se puede editar después
   ```

---

### ✅ **PASO 11: VER REPORTES**

**URL:** `http://localhost:3000/reports`

**Acciones a probar:**

1. **Cargar reportes**
   ```
   1. Ir a REPORTES
   2. Seleccionar filtros:
      - Semestre: 1
      - Año: 2024
   3. Click "Generar Reporte"
   4. ✅ KPI y datos se cargan
   ```

2. **Verificar KPI global**
   ```
   Debería mostrar tarjetas:
   
   ✅ CUMPLE: 1 (100%)
   ✅ NO_CUMPLE: 0 (0%)
   ✅ NO_APLICA: 0 (0%)
   ✅ PENDIENTE: 0 (0%)
   ✅ Total Revisiones: 1
   ✅ Total Validaciones: 1 (o más si hay múltiples)
   ```

3. **Ver gráfico de barras**
   ```
   ✅ Gráfico muestra distribución de estados
   ✅ Eje X: Estados (CUMPLE, NO_CUMPLE, etc.)
   ✅ Eje Y: Cantidad
   ✅ Barras en colores diferenciados
   ```

4. **Filtrar por municipio**
   ```
   1. Cambiar filtro a "Vista por Municipio"
   2. Seleccionar municipio: La Paz
   3. Click "Actualizar"
   4. ✅ Datos filtrados por municipio
   5. ✅ Muestra: La Paz = 100% (1/1 cumplido)
   ```

5. **Filtrar por convenio**
   ```
   1. Cambiar filtro a "Vista por Convenio"
   2. Seleccionar: CONV-TEST-001
   3. Click "Actualizar"
   4. ✅ Datos de ese convenio específico
   5. ✅ Actividades mostradas: 1
   6. ✅ Cumplimiento: 100%
   ```

6. **Exportar reporte**
   ```
   1. Click botón "Exportar PDF" o "Descargar"
   2. ✅ PDF generado
   3. ✅ Contiene: Titulo, datos, gráficos, fecha
   4. ✅ Se descarga a carpeta Descargas
   ```

---

### ✅ **PASO 12: SEGUIMIENTO DE ACTIVIDADES**

**URL:** `http://localhost:3000/activity-tracking`

**Acciones a probar:**

1. **Cargar página de seguimiento**
   ```
   1. Ir a SEGUIMIENTO DE ACTIVIDADES
   2. ✅ Página carga con estadísticas
   3. ✅ Muestra resumen de cumplimiento
   ```

2. **Ver gráficos de tendencia**
   ```
   ✅ Gráfico de líneas mostrando progreso
   ✅ Filtros de período disponibles
   ✅ Puede cambiar semestre/año
   ```

3. **Ver tabla de actividades**
   ```
   Tabla con columnas:
   ✅ Actividad
   ✅ Municipio
   ✅ Convenio
   ✅ Estado actual
   ✅ Progreso (%)
   ✅ Vencimiento
   ✅ Acciones
   ```

---

### ✅ **PASO 13: PRUEBAS CON DIFERENTES ROLES**

**Para Supervisor:**

1. **Logout**
   ```
   1. Click usuario → Cerrar sesión
   2. ✅ Sesión cerrada
   ```

2. **Login como Supervisor**
   ```
   Email: supervisor@example.com
   Password: supervisor123
   ```

3. **Verificar permisos limitados**
   ```
   ✅ Puede ver: Convenios, Reportes, Actividades
   ✅ NO puede ver: Gestión de Programas/Municipios
   ✅ Puede crear revisiones
   ✅ Puede subir evidencias
   ❌ NO puede cerrar convenios
   ```

**Para Encargado:**

1. **Login como Encargado**
   ```
   Email: encargado@example.com
   Password: encargado123
   ```

2. **Verificar permisos más limitados**
   ```
   ✅ Puede ver: Solo sus convenios
   ✅ Puede subir evidencias
   ✅ Puede editar actividades asignadas
   ❌ NO puede crear convenios
   ❌ NO puede cerrar convenios
   ❌ NO puede ver reportes globales
   ```

---

## 🐛 VALIDACIONES TÉCNICAS

### **API Endpoints a Validar**

**1. Autenticación**
```bash
POST /auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
✅ Retorna: { access_token, user }
```

**2. Convenios**
```bash
POST /agreements
GET /agreements
GET /agreements/:id
PATCH /agreements/:id
DELETE /agreements/:id

Todos deben:
✅ Requieren JWT token
✅ Generan auditoría
✅ Validar permisos
```

**3. Actividades**
```bash
POST /agreement-activities
PATCH /agreement-activities/:id
GET /agreement-activities/:id

Validar:
✅ Relación con convenio
✅ Control de edición (convenio ABIERTO)
✅ Auditoría de cambios
```

**4. Evidencias** (NEW - Sprint 6)
```bash
POST /evidences/upload (FormData)
POST /evidences
GET /evidences
GET /evidences/by-review/:reviewId
PATCH /evidences/:id
DELETE /evidences/:id

Validar:
✅ Multer acepta archivos
✅ DocumentType inferido correctamente
✅ Auditoría UPLOAD_EVIDENCE
✅ Soft delete vs hard delete
```

**5. Auditoría** (NEW - Sprint 7)
```bash
GET /audits/entity/:entityType/:entityId
GET /audits/user/:userId
GET /audits/action/:action
GET /audits/stats

Validar:
✅ Todos los cambios registrados
✅ Usuario y timestamp correctos
✅ Cambios (antes/después) capturados
✅ Acción correcta
```

### **Validaciones en Consola del Navegador**

```javascript
// 1. Verificar token JWT
localStorage.getItem('access_token')
// Debe retornar: eyJhbGciOiJIUzI1NiIs...

// 2. Decodificar token (opcional)
const token = localStorage.getItem('access_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
// Debe mostrar: { sub, email, role, iat, exp }

// 3. Verificar API calls
// F12 → Network → Click en request
// Response debe ser JSON válido

// 4. Ver errores en console
// F12 → Console
// No debe haber errores rojo (solo warnings naranja)
```

---

## 📈 FLUJO DE TESTING RECOMENDADO

```
1. AUTENTICACIÓN (5 min)
   ├─ Login Admin ✅
   ├─ Login con credenciales inválidas ✅
   └─ Logout ✅

2. EXPLORACIÓN (10 min)
   ├─ Dashboard ✅
   ├─ Municipios (ver precargados) ✅
   └─ Programas (ver precargados) ✅

3. CREAR CONVENIO (10 min)
   ├─ Crear nuevo ✅
   ├─ Verificar en lista ✅
   └─ Abrir detalles ✅

4. AGREGAR ACTIVIDADES (10 min)
   ├─ Agregar actividad ✅
   ├─ Llenar todos los campos ✅
   └─ Guardar y verificar ✅

5. SUBIR EVIDENCIAS (15 min)
   ├─ PDF ✅
   ├─ Imagen ✅
   ├─ Excel ✅
   ├─ Word ✅
   └─ Verificar lista ✅

6. VER AUDITORÍA (5 min)
   ├─ Verificar CREATE ✅
   ├─ Verificar UPDATE ✅
   └─ Verificar UPLOAD_EVIDENCE ✅

7. CERRAR CONVENIO (5 min)
   ├─ Cerrar ✅
   ├─ Verificar deshabilitación ✅
   └─ Reabrir ✅

8. CREAR REVISIÓN (10 min)
   ├─ Nueva revisión ✅
   ├─ Validar actividades ✅
   ├─ Agregar observaciones ✅
   └─ Completar ✅

9. VER REPORTES (10 min)
   ├─ Cargar global ✅
   ├─ Ver KPI ✅
   ├─ Filtrar por municipio ✅
   ├─ Ver gráficos ✅
   └─ Exportar PDF ✅

10. ROLES DIFERENTES (10 min)
    ├─ Logout ✅
    ├─ Login Supervisor ✅
    ├─ Verificar permisos ✅
    ├─ Login Encargado ✅
    └─ Verificar permisos ✅

TOTAL: ~90 minutos de testing completo
```

---

## ✅ CRITERIOS DE ÉXITO

### **Backend debe:**
- ✅ Compilar sin errores: `npm run build`
- ✅ Correr sin crashes: `npm run start:dev`
- ✅ Responder a todos los endpoints
- ✅ Generar auditoría en cada cambio
- ✅ Validar permisos JWT
- ✅ Rechazar solicitudes sin token

### **Frontend debe:**
- ✅ Cargar sin errores: `npm run dev`
- ✅ Compilar TypeScript: `npx tsc --noEmit`
- ✅ Mostrar UI correctamente
- ✅ Enviar requests con JWT
- ✅ Mostrar datos de API
- ✅ Permitir interacciones (click, input, etc.)

### **Base de datos debe:**
- ✅ Persistir todos los datos
- ✅ Mantener relaciones
- ✅ Registrar auditoría
- ✅ Calcular estadísticas correctamente

### **Integración debe:**
- ✅ Login → Dashboard (flujo completo)
- ✅ Crear convenio → Aparecer en lista
- ✅ Actividad → Subir evidencia → Ver en lista
- ✅ Cambios → Registrarse en auditoría
- ✅ Revisar → Generar reporte con datos correctos

---

**¡Estás listo para testing! 🚀**

