# 📘 TUTORIAL COMPLETO - POA TRACKER

## 🎯 ¿Qué es POA Tracker?

**POA Tracker** es un sistema de seguimiento de **Planes Operativos Anuales (POA)** para gestionar convenios, programas, actividades y su cumplimiento a nivel municipal.

---

## 📋 MÓDULOS DEL MENÚ LATERAL (Izquierda)

Después de hacer login, verás estos 9 módulos principales:

### 1. 🏠 **DASHBOARD** (/)
**¿Qué hace?**
- Página de inicio con resumen estadístico
- Muestra 4 tarjetas con métricas clave:
  - **Total POAs:** Número de Planes Operativos creados
  - **Completados:** Actividades finalizadas (CUMPLE)
  - **En Revisión:** Actividades pendientes de validar
  - **Por Completar:** Actividades faltantes

**Flujo:**
```
Login → Dashboard → Ver resumen general
```

---

### 2. 📄 **POAs** (/poas)
**¿Qué hace?**
- Gestiona los **Planes Operativos Anuales**
- Son plantillas que contienen actividades planeadas
- Permite ver y crear nuevos POAs

**Características:**
- ✅ Ver listado de POAs disponibles
- ✅ Ver detalles de cada POA
- ✅ Asociar POAs con convenios

**Datos típicos:**
- Código del POA
- Nombre/Descripción
- Año fiscal
- Estado

---

### 3. 📋 **ACTIVIDADES** (/activities)
**¿Qué hace?**
- Muestra todas las **actividades operativas** del sistema
- Son tareas específicas dentro de los POAs

**Características:**
- ✅ Ver actividades por programa
- ✅ Ver el estado de cada actividad
- ✅ Ver indicadores de cumplimiento

**Datos típicos:**
- Descripción de la actividad
- Programa responsable
- Meta cuantitativa
- Unidad de medida (cantidad, %, etc.)

---

### 4. 📊 **REPORTES** (/reports)
**¿Qué hace?**
- **Análisis y visualización** de cumplimiento de objetivos
- Genera gráficos y estadísticas

**Características principales:**

#### A) **Reportes Globales**
- KPI general del sistema
- Cumplimiento por estado: CUMPLE, NO_CUMPLE, NO_APLICA, PENDIENTE
- Porcentajes de avance

#### B) **Reportes por Municipio**
- Filtrar por municipio específico
- Ver cumplimiento local
- Comparar desempeño entre municipios

#### C) **Reportes por Convenio**
- Detalles de cumplimiento por acuerdo
- Ver actividades asociadas

**Gráficos disponibles:**
- Gráficos de barras (cumplimiento)
- Porcentajes por estado
- Tendencias temporales

**Filtros:**
```
Semestre: 1 o 2
Año: 2023, 2024, 2025, etc.
```

---

### 5. 🗺️ **MUNICIPIOS** (/municipalities)
**¿Qué hace?**
- Gestiona los **municipios** del país
- Cada municipio tiene un departamento
- Base para identificar responsables de cumplimiento

**Características:**
- ✅ Ver listado de municipios
- ✅ Ver municipios por departamento
- ✅ Ver convenios en cada municipio

**Estructura:**
```
Departamento (ej: La Paz)
  └─ Municipio 1 (ej: La Paz capital)
  └─ Municipio 2 (ej: El Alto)
  └─ Municipio 3 (ej: Pucarani)
```

---

### 6. 📑 **CONVENIOS** (/agreements)
**¿Qué hace?**
- Gestiona los **acuerdos o convenios** entre municipios y el estado
- Cada convenio tiene un municipio responsable
- Contiene actividades a cumplir

**Características principales:**

#### Información del Convenio:
- Código único
- Municipio responsable
- Departamento
- Descripción
- Fecha de inicio/fin
- Estado del convenio

#### Actividades del Convenio:
- Lista de actividades asociadas
- Estado de cada actividad
- Responsable
- Meta cuantitativa

#### Edición y Control:
- Solo puedes editar convenios **ABIERTOS**
- Cuando está **CERRADO**, no se permite editar
- Hay un botón para **REABRIRLO** si es necesario

**Ciclo de vida:**
```
1. Crear Convenio (ABIERTO)
   ↓
2. Agregar Actividades
   ↓
3. Editar información según sea necesario
   ↓
4. CERRAR el convenio (cuando está listo)
   ↓
5. Crear REVISIONES (validaciones de cumplimiento)
   ↓
6. Opcionalmente REABRIR si necesitas ajustes
```

---

### 7. 🎯 **PROGRAMAS** (/programs)
**¿Qué hace?**
- Gestiona los **programas operativos** del estado
- Agrupa actividades relacionadas

**Características:**
- ✅ Ver programas disponibles
- ✅ Ver actividades en cada programa
- ✅ Ver responsables

**Ejemplos de programas:**
- Educación
- Salud
- Infraestructura
- Desarrollo Rural
- etc.

---

### 8. 📋 **PLANTILLAS POA** (/poa-templates)
**¿Qué hace?**
- Crea **plantillas reutilizables** de POAs
- Permite crear POAs de forma eficiente sin empezar desde cero

**Características:**
- ✅ Crear nuevas plantillas
- ✅ Usar plantillas existentes
- ✅ Duplicar plantillas

**Flujo típico:**
```
1. Crear Plantilla POA (definir estructura)
   ↓
2. Agregar actividades a la plantilla
   ↓
3. Usar plantilla para crear POAs finales
```

---

### 9. 🔍 **SEGUIMIENTO DE ACTIVIDADES** (/activity-tracking)
**¿Qué hace?**
- **Dashboard detallado** de seguimiento
- Visualizar cumplimiento de cada actividad en tiempo real
- Trackear métricas y KPIs

**Características:**
- ✅ Estadísticas de cumplimiento
- ✅ Gráficos de tendencia
- ✅ Alertas de actividades vencidas
- ✅ Filtros por programa, municipio, estado

---

## 🔄 FLUJO COMPLETO DE USO

### **FLUJO 1: Creación de un Convenio**

```
1. Ir a CONVENIOS
   │
2. Click "Crear Nuevo Convenio"
   │
3. Llenar formulario:
   ├─ Municipio: Seleccionar municipio
   ├─ Código: Ej: "CONV-2024-001"
   ├─ Descripción: Breve descripción del acuerdo
   ├─ Fecha inicio/fin
   └─ Estado: ABIERTO
   │
4. Guardar
   │
5. El convenio aparece en la lista
   │
6. Click en el convenio para ver detalles
```

---

### **FLUJO 2: Agregar Actividades a un Convenio**

```
1. Abrir un CONVENIO existente
   │
2. Ir a la sección "Actividades"
   │
3. Click "Agregar Actividad"
   │
4. Llenar formulario:
   ├─ Seleccionar actividad del POA
   ├─ Meta cuantitativa (ej: 100)
   ├─ Unidad de medida (ej: personas, km, %)
   ├─ Responsable
   └─ Descripción adicional
   │
5. Guardar
   │
6. La actividad se agrupa en el convenio
```

---

### **FLUJO 3: Cerrar un Convenio**

```
1. Abrir CONVENIO (estado: ABIERTO)
   │
2. Todas las actividades deben estar completas
   │
3. Click botón "CERRAR CONVENIO"
   │
4. Cambio de estado: ABIERTO → CERRADO
   │
5. Ahora NO SE PUEDE editar el convenio
   │
6. (Opcional) Click "REABRIR" para volver a ABIERTO si necesitas cambios
```

---

### **FLUJO 4: Crear una REVISIÓN (Validación)**

```
1. Ir a REPORTES o SEGUIMIENTO
   │
2. Seleccionar periodo a revisar:
   ├─ Semestre: 1 o 2
   └─ Año: 2024, 2025, etc.
   │
3. Por cada actividad, validar estado:
   ├─ ✅ CUMPLE (se completó)
   ├─ ❌ NO_CUMPLE (no se hizo)
   ├─ ⊘ NO_APLICA (no era necesaria)
   └─ ⏳ PENDIENTE (aún en proceso)
   │
4. Agregar observaciones si es necesario
   │
5. Guardar revisión
   │
6. Sistema genera REPORTE con datos actualizados
   │
7. Se REGISTRA en AUDITORÍA (quién cambió qué y cuándo)
```

---

### **FLUJO 5: Subir Evidencias**

```
1. Abrir una ACTIVIDAD en el CONVENIO
   │
2. En la sección "Evidencias", click "SUBIR ARCHIVO"
   │
3. Seleccionar archivo:
   ├─ Tipos soportados: PDF, IMG, EXCEL, WORD, VIDEO, AUDIO
   └─ Tamaño máximo: (configurable)
   │
4. Indicar tipo de documento:
   ├─ PDF
   ├─ Imagen
   ├─ Excel
   ├─ Word
   ├─ Video
   ├─ Audio
   └─ Otro
   │
5. Agregar descripción
   │
6. Click "SUBIR"
   │
7. Archivo se guarda y se vincula a la actividad
   │
8. Ver historial de evidencias
```

---

### **FLUJO 6: Ver Auditoría (Historial de Cambios)**

```
1. Abrir un CONVENIO o ACTIVIDAD
   │
2. Ir a sección "AUDITORÍA"
   │
3. Ver timeline de cambios:
   ├─ Tipo de cambio: CREATE, UPDATE, DELETE, UPLOAD, etc.
   ├─ Quién lo hizo: Usuario
   ├─ Cuándo: Timestamp
   ├─ Qué cambió: Datos anteriores vs nuevos
   └─ Razón: Motivo del cambio
   │
4. Esto es de solo lectura (para auditar)
```

---

## 🔐 CONTROL DE EDICIÓN

### **¿Cuándo puedo editar?**

| Recurso | Estado | ¿Editable? | Notas |
|---------|--------|----------|-------|
| Convenio | ABIERTO | ✅ Sí | Puedes cambiar todo |
| Convenio | CERRADO | ❌ No | Necesitas REABRIR |
| Actividad | Convenio ABIERTO | ✅ Sí | Editar metas y responsable |
| Revisión | DRAFT | ✅ Sí | Editar validaciones |
| Revisión | CLOSED | ❌ No | Histórico de validaciones |
| Evidencia | Siempre | ✅ Sí | Editar descripción |
| Programa | - | ⚠️ Admin | Solo administrador |
| Municipio | - | ⚠️ Admin | Solo administrador |

---

## 📊 EJEMPLO PRÁCTICO COMPLETO

Supón que tienes un proyecto de "Capacitación en Educación Digital" en La Paz:

### **Paso 1: Crear el Convenio**
```
Módulo: CONVENIOS
├─ Crear Convenio
├─ Municipio: La Paz
├─ Código: CONV-CAP-2024-LP-001
├─ Descripción: Capacitación en tecnología educativa
├─ Fecha: 01/01/2024 al 31/12/2024
└─ Estado: ABIERTO
```

### **Paso 2: Agregar Actividades**
```
Actividad 1:
├─ Descripción: Capacitación a docentes
├─ Meta: 500 personas
├─ Unidad: Docentes capacitados
├─ Responsable: Director de Educación
└─ Fecha límite: 30/06/2024

Actividad 2:
├─ Descripción: Distribución de equipos
├─ Meta: 50 equipos
├─ Unidad: Computadoras
├─ Responsable: Responsable de Logística
└─ Fecha límite: 15/06/2024
```

### **Paso 3: Subir Evidencias (Junio 2024)**
```
Para Actividad 1:
├─ Subir lista de asistencia (PDF)
├─ Subir fotos del evento (IMG)
└─ Subir certificados (WORD)

Para Actividad 2:
├─ Subir factura de compra (EXCEL)
├─ Subir acta de entrega (PDF)
└─ Subir fotos de equipos (IMG)
```

### **Paso 4: Crear Revisión Semestral**
```
Módulo: REPORTES
├─ Semestre: 1 (Enero-Junio)
├─ Año: 2024
│
├─ Actividad 1:
│  ├─ Estado: ✅ CUMPLE
│  ├─ Justificación: Se capacitó a 520 docentes
│  └─ Evidencias: Certificados en expediente
│
└─ Actividad 2:
   ├─ Estado: ✅ CUMPLE
   ├─ Justificación: Se entregaron 50 computadoras
   └─ Evidencias: Actas de entrega
```

### **Paso 5: Ver Reporte**
```
Módulo: REPORTES
├─ KPI General:
│  ├─ CUMPLE: 2 (100%)
│  ├─ NO_CUMPLE: 0
│  ├─ NO_APLICA: 0
│  └─ PENDIENTE: 0
│
├─ Gráfico: 100% completado
│
├─ Cumplimiento por Municipio: La Paz = 100%
│
└─ Exportar reporte (PDF)
```

### **Paso 6: Auditoría**
```
Módulo: CONVENIOS → Ver Convenio → Auditoría
├─ 01/01/2024 10:30 - CREATE - Usuario: admin@poc.gov
├─ 05/02/2024 14:15 - UPDATE - Usuario: supervisor@lapaz.gov
│  └─ Cambios: Meta actualizada 500→520
├─ 10/06/2024 09:00 - UPLOAD_EVIDENCE - Usuario: encargado@lapaz.gov
│  └─ Archivo: lista_asistencia.pdf
├─ 15/06/2024 16:45 - UPDATE - Usuario: revisor@poc.gov
│  └─ Cambios: Status revisión → COMPLETED
└─ 20/06/2024 11:20 - CLOSE - Usuario: director@poc.gov
   └─ Razón: Primer semestre completado
```

---

## 🔑 ROLES Y PERMISOS

### **ADMIN**
- ✅ Acceso a TODOS los módulos
- ✅ Crear/Editar/Eliminar convenios
- ✅ Crear municipios y programas
- ✅ Ver auditoría completa
- ✅ Cerrar/Reabrir convenios

### **SUPERVISOR**
- ✅ Ver reportes
- ✅ Crear/Editar convenios
- ✅ Validar actividades
- ✅ Subir evidencias
- ❌ Crear programas
- ❌ Cerrar convenios

### **ENCARGADO**
- ✅ Ver sus convenios
- ✅ Subir evidencias
- ✅ Editar actividades asignadas
- ❌ Crear convenios
- ❌ Ver todos los convenios

---

## 🎨 NAVEGACIÓN RÁPIDA

### **Para Acceder Rápidamente a:**

| Tarea | Ruta | Atajo |
|-------|------|-------|
| Ver progreso general | Dashboard | Home |
| Crear nuevo convenio | Convenios | C |
| Buscar actividades | Actividades | A |
| Ver KPI | Reportes | R |
| Subir evidencias | Convenios → Detalles | E |
| Ver auditoría | Cualquier recurso → Auditoría | Shift+L |
| Cerrar convenio | Convenios → Detalles → Cerrar | Ctrl+Q |
| Exportar reporte | Reportes → Exportar | Ctrl+S |

---

## ⚠️ TIPS Y MEJORES PRÁCTICAS

### **✅ HACED:**
1. ✅ Subir evidencias regularmente (no dejar para último momento)
2. ✅ Documentar cambios con observaciones
3. ✅ Revisar auditoría antes de cerrar períodos
4. ✅ Hacer backups de reportes generados
5. ✅ Actualizar estados de actividades periódicamente

### **❌ NO HAGÁIS:**
1. ❌ Cerrar convenios sin completar todas las actividades
2. ❌ Subir archivos sin descripción
3. ❌ Dejar cambios sin observaciones
4. ❌ Editar datos finales sin auditoría
5. ❌ Confundir CERRAR convenio con eliminar

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### **"No puedo editar el convenio"**
```
✅ Solución: El convenio está CERRADO
→ Click "REABRIR" para poder editarlo
→ Realiza los cambios
→ Click "CERRAR" nuevamente
```

### **"No veo mis evidencias"**
```
✅ Solución: Asegúrate que:
→ Estés en la actividad correcta
→ Los archivos se hayan cargado (ver progreso)
→ Tengas permisos de lectura
→ Intenta refrescar la página
```

### **"El reporte no muestra datos"**
```
✅ Solución:
→ Verifica que hay actividades con estados asignados
→ Asegúrate que el período seleccionado es correcto
→ Comprueba que hay al menos 1 revisión registrada
→ Intenta cambiar de semestre/año
```

### **"No puedo crear un convenio"**
```
✅ Solución:
→ Verifica tu rol (necesitas ADMIN o SUPERVISOR)
→ Asegúrate de tener municipio seleccionado
→ Comprueba que el POA existe
→ Intenta refrescar la sesión
```

---

## 🔄 DIAGRAMA DE FLUJO GENERAL

```
┌─────────────┐
│   LOGIN     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│        DASHBOARD (Inicio)            │
│  - Ver estadísticas generales        │
│  - Resumen de cumplimiento          │
│  - Acceso rápido a módulos          │
└──────┬──────────────────────────────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
   ┌──────────┐                      ┌──────────┐
   │ CREAR    │                      │ VER      │
   │ CONVENIO │                      │ REPORTES │
   └────┬─────┘                      └──────────┘
        │
        ├─ Seleccionar Municipio
        ├─ Rellenar Datos
        └─ Guardar
        │
        ▼
   ┌─────────────────┐
   │ AGREGAR         │
   │ ACTIVIDADES     │
   └────┬────────────┘
        │
        ├─ Seleccionar del POA
        ├─ Definir Metas
        └─ Asignar Responsable
        │
        ▼
   ┌─────────────────┐
   │ SUBIR           │
   │ EVIDENCIAS      │
   └────┬────────────┘
        │
        ├─ Archivos (PDF, IMG, etc.)
        ├─ Descripción
        └─ Guardar
        │
        ▼
   ┌─────────────────┐
   │ CERRAR          │
   │ CONVENIO        │
   └────┬────────────┘
        │
        ├─ Todas las actividades completas
        ├─ Evidencias subidas
        └─ Cambio: ABIERTO → CERRADO
        │
        ▼
   ┌─────────────────┐
   │ CREAR REVISIÓN  │
   │ (Validación)    │
   └────┬────────────┘
        │
        ├─ Por actividad: CUMPLE/NO_CUMPLE/NO_APLICA/PENDIENTE
        ├─ Agregar observaciones
        └─ Guardar
        │
        ▼
   ┌─────────────────┐
   │ GENERAR         │
   │ REPORTE         │
   └────┬────────────┘
        │
        ├─ KPIs calculados
        ├─ Gráficos generados
        ├─ Porcentajes de cumplimiento
        └─ Exportar a PDF
        │
        ▼
   ┌─────────────────┐
   │ VER AUDITORÍA   │
   │ (Historial)     │
   └─────────────────┘
        │
        └─ Quién cambió qué, cuándo y por qué
```

---

## 📞 CONTACTO Y SOPORTE

- **Email:** soporte@poa-tracker.gov
- **Teléfono:** +591-2-XXXXXXXX
- **Documentación:** /docs
- **Reportar Bug:** /issues

---

**¡Ya estás listo para usar POA Tracker! 🚀**

