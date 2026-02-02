# 🎯 RESUMEN EJECUTIVO - MÓDULOS Y FUNCIONES

## 📍 MAPA DE NAVEGACIÓN

```
                    ┌─────────────────────────────────────────────────┐
                    │      🏠 DASHBOARD (Home)                        │
                    │   Estadísticas generales y resumen              │
                    └────────────────────┬────────────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
    ┌──────────┐                   ┌──────────┐                  ┌──────────────┐
    │📄 POAs   │                   │📋 ACTIV. │                  │📊 REPORTES   │
    │          │                   │          │                  │ Análisis KPI │
    │Ver POAs  │                   │Ver todas │                  │ Gráficos     │
    │          │                   │          │                  │ Export PDF   │
    └──────────┘                   └──────────┘                  └──────────────┘
        │                                │                                │
        └────────────────────────────────┼────────────────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
    ┌──────────┐                   ┌──────────┐                  ┌──────────────┐
    │🗺️  MUNIC.│                   │📑 CONVEN.│                  │🎯 PROGRAMAS  │
    │          │                   │ PRINCIPAL│                  │              │
    │Municipios│                   │ MÓDULO 🌟│                  │Programas OA  │
    │Depart.   │                   │          │                  │ Actividades  │
    └──────────┘                   └────┬─────┘                  └──────────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          │              │              │
                          ▼              ▼              ▼
                    ┌──────────┐    ┌──────────┐   ┌──────────┐
                    │Activid.  │    │Evidencias│   │Auditoría │
                    │del Conv. │    │(NEW SP6) │   │(NEW SP7) │
                    │          │    │📎 Archiv│   │📜 Cambios│
                    └──────────┘    └──────────┘   └──────────┘
                          │              │              │
                          └──────────────┼──────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
                    ▼                                         ▼
            ┌──────────────┐                         ┌──────────────┐
            │📋 REVISIONES │                         │📊 SEGUIMIENTO│
            │Validaciones  │                         │Tracking KPI  │
            │Cumplimiento  │                         │Tendencias    │
            │Status update │                         │Alertas       │
            └──────────────┘                         └──────────────┘
                    │                                         │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  📋 PLANTILLAS POA              │
                    │  (Reutilizable)                 │
                    │  ✅ Crear plantilla             │
                    │  ✅ Usar para nuevos POAs       │
                    └─────────────────────────────────┘
```

---

## 📚 TABLA COMPARATIVA DE MÓDULOS

| # | Módulo | Icono | URL | Función Principal | Usuario Ver | Usuario Editar | Datos Precargados |
|---|--------|-------|-----|-------------------|-------------|----------------|-------------------|
| 1 | Dashboard | 🏠 | / | Resumen estadístico | TODO | ❌ | ❌ |
| 2 | POAs | 📄 | /poas | Planes operativos | ADMIN/SUP | ADMIN | ❌ |
| 3 | Actividades | 📋 | /activities | Tareas operativas | TODO | ADMIN/SUP | ❌ |
| 4 | **Reportes** | 📊 | /reports | KPI y gráficos | TODO | ❌ | ❌ |
| 5 | Municipios | 🗺️ | /municipalities | Geografía | TODO | ADMIN | ✅ (33 + 252) |
| 6 | **Convenios** | 📑 | /agreements | ⭐ MÓDULO CENTRAL | TODO | Según rol | ❌ |
| 7 | Programas | 🎯 | /programs | Agrupadores | TODO | ADMIN | ✅ |
| 8 | Plantillas | 📋 | /poa-templates | Reutilizables | ADMIN/SUP | ADMIN/SUP | ❌ |
| 9 | Seguimiento | 📈 | /activity-tracking | Tracking en tiempo real | TODO | ❌ | ❌ |

---

## 🌟 MÓDULO CENTRAL: CONVENIOS

### Estructura del Convenio

```
┌─────────────────────────────────────────────────────────────┐
│  CONVENIO (CONV-2024-LP-001)                                │
│  Municipio: La Paz | Programa: Educación | Estado: ABIERTO  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 INFORMACIÓN BÁSICA                                      │
│  ├─ Código: CONV-2024-LP-001                              │
│  ├─ Municipio: La Paz (Departamento: La Paz)              │
│  ├─ Descripción: Capacitación docente                     │
│  ├─ Programa: Educación                                   │
│  ├─ Fecha: 01/01/2024 - 31/12/2024                        │
│  └─ Estado: ABIERTO (botones: Editar, Cerrar)             │
│                                                             │
│  📋 ACTIVIDADES (2 agregadas)                              │
│  ├─ Actividad 1: Capacitación a docentes                  │
│  │  ├─ Meta: 500 docentes                                 │
│  │  ├─ Responsable: Director Educación                    │
│  │  ├─ Estado: PENDIENTE                                  │
│  │  ├─ Acciones: 📎 Evidencias | ✏️ Editar | 🗑️ Eliminar│
│  │  └─ Evidencias: 0 archivos                             │
│  │                                                          │
│  └─ Actividad 2: Distribución equipos                     │
│     ├─ Meta: 50 equipos                                   │
│     ├─ Responsable: Jefe Logística                        │
│     ├─ Estado: PENDIENTE                                  │
│     ├─ Acciones: 📎 Evidencias | ✏️ Editar | 🗑️ Eliminar│
│     └─ Evidencias: 3 archivos                             │
│                                                             │
│  📎 EVIDENCIAS (Actividad 1)                               │
│  ├─ [PDF] lista_asistencia.pdf (2.3 MB) - Admin - 10/06  │
│  ├─ [IMG] foto_evento_001.jpg (1.8 MB) - Admin - 10/06   │
│  ├─ [IMG] foto_evento_002.jpg (2.1 MB) - Admin - 10/06   │
│  └─ [WORD] certificados.docx (0.9 MB) - Admin - 10/06    │
│                                                             │
│  📜 AUDITORÍA (Timeline)                                   │
│  ├─ 01/01/2024 10:30 - CREATE - Admin                     │
│  ├─ 05/02/2024 14:15 - UPDATE - Supervisor (Meta 500→520)│
│  ├─ 10/06/2024 09:00 - UPLOAD - Admin (lista_asistencia) │
│  ├─ 10/06/2024 15:30 - UPLOAD - Admin (fotos)            │
│  ├─ 10/06/2024 16:00 - UPLOAD - Admin (certificados)     │
│  └─ 20/06/2024 11:20 - CLOSE - Director                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Ciclo de Vida del Convenio

```
CREACIÓN (Estado: ABIERTO)
    ↓
    ✅ Editable: SÍ
    ├─ Editar información
    ├─ Agregar actividades
    ├─ Modificar metas
    └─ Cambiar responsables
    ↓
LLENADO DE DATOS
    ↓
    ✅ Actividades completas
    ├─ Metas definidas
    ├─ Responsables asignados
    └─ Descripción llena
    ↓
CIERRE (Estado: CERRADO)
    ↓ [Click "Cerrar Convenio"]
    ↓
PERÍODO CERRADO (No editable)
    ↓
    ❌ Editable: NO
    ├─ Información: Solo lectura
    ├─ Actividades: Solo lectura
    ├─ Evidencias: Leer/Subir OK, Editar❌
    └─ Opción: "Reabrir" disponible
    ↓
AUDITORÍA COMPLETA
    ↓
    (Si necesita cambios...)
    ↓ [Click "Reabrir Convenio"]
    ↓
REAPERTURA (Estado: ABIERTO)
    ↓
    ✅ Vuelve a ser editable
    ├─ Hacer ajustes
    ├─ Actualizar datos
    └─ Volver a cerrar
```

---

## 🔄 FLUJOS DE TRABAJO TIPICOS

### **Flujo 1: Nuevo Convenio**

```
ACTOR: ADMIN/SUPERVISOR

1. Click "CONVENIOS"
   └─ Ve lista vacía

2. Click "+ Crear Convenio"
   └─ Abre formulario

3. Llena campos:
   ├─ Municipio: La Paz
   ├─ Código: CONV-2024-LP-001
   ├─ Descripción: Capacitación
   ├─ Programa: Educación
   ├─ Fechas: 01/01 - 31/12/2024
   └─ Click "Guardar"

4. Convenio creado
   └─ Status: ABIERTO
   └─ Auditoría: CREATE registrada

5. Aparece en tabla
   └─ Click para abrir detalles
```

### **Flujo 2: Agregar Actividad**

```
ACTOR: ADMIN/SUPERVISOR (Convenio ABIERTO)

1. Abrir convenio
2. Scroll a "Actividades"
3. Click "+ Agregar Actividad"
4. Llenar:
   ├─ Actividad: (seleccionar)
   ├─ Meta: 500
   ├─ Unidad: personas
   ├─ Responsable: Jefe Dirección
   └─ Click "Guardar"
5. Actividad aparece en tabla
6. Auditoría: CREATE actividad
```

### **Flujo 3: Subir Evidencia**

```
ACTOR: CUALQUIERA (Con acceso)

1. Convenio → Actividad
2. Click "Evidencias"
3. Drag & Drop archivo
   └─ Detecta tipo (PDF, IMG, etc.)
   └─ Muestra preview
4. Llenar descripción
5. Click "Subir"
6. Archivo en lista
7. Auditoría: UPLOAD_EVIDENCE
```

### **Flujo 4: Crear Revisión**

```
ACTOR: SUPERVISOR (Validador)

1. Click "REPORTES"
2. Click "Nueva Revisión"
3. Seleccionar:
   ├─ Semestre: 1
   ├─ Año: 2024
   └─ Municipio: (opcional)
4. Por cada actividad:
   ├─ Seleccionar estado
   ├─ CUMPLE / NO_CUMPLE / NO_APLICA / PENDIENTE
   ├─ Agregar observación
   └─ Click "Guardar"
5. Completar revisión
6. Status: CLOSED
7. Reportes actualizados
```

### **Flujo 5: Ver Reportes**

```
ACTOR: TODO (Lectura)

1. Click "REPORTES"
2. Filtros:
   ├─ Semestre: 1
   ├─ Año: 2024
   └─ Municipio: (opcional)
3. Click "Generar"
4. Muestra:
   ├─ KPI cards (CUMPLE%, NO_CUMPLE%, etc.)
   ├─ Gráfico de barras
   ├─ Tabla de detalles
   └─ Botón exportar PDF
5. Click "Exportar"
6. PDF descargado
```

---

## 📊 VISTA RÁPIDA: ¿QUÉ SE VE EN CADA PANTALLA?

### **DASHBOARD (/)**
```
┌─────────────────────────────────────┐
│ Bienvenido a POA Tracker           │
│ Sistema de seguimiento...          │
├─────────────────────────────────────┤
│                                     │
│ [Total POAs]    [Completados]       │
│     0              0                │
│                                     │
│ [En Revisión]   [Por Completar]    │
│     0              0                │
│                                     │
│ Últimas actividades...             │
│ (Lista vacía si sin datos)         │
│                                     │
└─────────────────────────────────────┘
```

### **MUNICIPIOS (/municipalities)**
```
┌──────────────────────────────────────────┐
│ Municipios (252 registros)              │
├──────────────────────────────────────────┤
│ Buscar: _____________ [Departamento ▼]  │
├──────────────────────────────────────────┤
│ Municipio          │ Departamento        │
├────────────────────┼──────────────────── │
│ La Paz             │ La Paz              │
│ El Alto            │ La Paz              │
│ Pucarani           │ La Paz              │
│ Santa Cruz de la S.│ Santa Cruz          │
│ ... (más resultados)                    │
└──────────────────────────────────────────┘
```

### **CONVENIOS (/agreements) - LISTA**
```
┌────────────────────────────────────────────────────────┐
│ Convenios [+ Crear]                                   │
├────────────────────────────────────────────────────────┤
│ Código        │ Municipio │ Estado   │ Acciones       │
├───────────────┼───────────┼──────────┼────────────────┤
│ CONV-TEST-001 │ La Paz    │ ABIERTO  │ Ver | Editar   │
│               │           │          │ Eliminar       │
└────────────────────────────────────────────────────────┘
(Si lista vacía: "No hay convenios creados")
```

### **CONVENIOS (/agreements/[id]) - DETALLE**
```
┌─────────────────────────────────────────────────────────┐
│ CONV-TEST-001 - Prueba de sistema   [Editar] [Cerrar]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Municipio: La Paz      Programa: (nombre)             │
│ Departamento: La Paz   Fecha: 01/01/2024 - 31/12/2024│
│ Estado: ABIERTO        Observaciones: ...              │
│                                                         │
│ ACTIVIDADES [+ Agregar]                               │
│ ┌─────────────────────────────────────────────────────┐
│ │ Descripción │ Meta │ Responsable │ Evidencias │ ⋮  │
│ ├─────────────────────────────────────────────────────┤
│ │ Capacit...  │ 100  │ Jefe Edu    │ 📎 3       │ ... │
│ │ Distrib...  │ 50   │ Jefe Log    │ 📎 0       │ ... │
│ └─────────────────────────────────────────────────────┘
│                                                         │
│ EVIDENCIAS (Actividad 1)                              │
│ ┌──────────────────────────────────────────────────────┐
│ │ 📄 lista_asistencia.pdf (2.3 MB) - 10/06/2024     │
│ │ 📷 foto_evento.jpg (1.8 MB) - 10/06/2024          │
│ │ [Drag & Drop area] ↓ Subir archivo...             │
│ └──────────────────────────────────────────────────────┘
│                                                         │
│ AUDITORÍA                                             │
│ 🕐 01/01 10:30 - CREATE - admin@example.com          │
│ 🕐 10/06 09:00 - UPLOAD - admin@example.com          │
│    └─ archivo: lista_asistencia.pdf                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **REPORTES (/reports)**
```
┌─────────────────────────────────────────────────────────┐
│ Reportes  [Semestre: 1 ▼] [Año: 2024 ▼] [Generar]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ KPI - Semestre 1, 2024                                │
│ ┌─────────────┬─────────────┬──────────┬─────────────┐
│ │ CUMPLE      │ NO_CUMPLE   │ NO_APLICA│ PENDIENTE   │
│ │    1 (100%) │   0 (0%)    │ 0 (0%)   │   0 (0%)    │
│ └─────────────┴─────────────┴──────────┴─────────────┘
│                                                         │
│ Gráfico:                                              │
│ 100%┤         ███                                      │
│  75%┤         ███                                      │
│  50%┤         ███                                      │
│  25%┤         ███                                      │
│   0%┤ ─────────███─────────────────────              │
│     └──────────────────────────────────              │
│        CUMPLE NO_C NO_A PENDIENTE                    │
│                                                         │
│ [Vista Global] [Por Municipio] [Por Convenio]        │
│ [📥 Exportar PDF]                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 SECUENCIA DE APRENDIZAJE RECOMENDADA

### **Semana 1: Exploración**
1. ✅ Login y familiarizarse con Dashboard
2. ✅ Explorar Municipios (ver datos precargados)
3. ✅ Explorar Programas (ver estructura)
4. ✅ Ver Reportes (vacíos inicialmente)

### **Semana 2: Creación Básica**
5. ✅ Crear primer Convenio
6. ✅ Agregar Actividades
7. ✅ Subir Evidencias
8. ✅ Cerrar Convenio

### **Semana 3: Validación**
9. ✅ Crear Revisión
10. ✅ Validar Actividades
11. ✅ Ver Reportes generados
12. ✅ Explorar Auditoría

### **Semana 4: Administración Avanzada**
13. ✅ Probar otros roles
14. ✅ Reabrير Convenios
15. ✅ Crear múltiples convenios
16. ✅ Comparar reportes entre períodos

---

## 🎯 MEMORAMA RÁPIDO

| Necesitas... | Ir a... | Haz esto... |
|-------------|---------|-----------|
| Ver progreso general | Dashboard | 🏠 Home |
| Crear un acuerdo | Convenios | 📑 + Crear |
| Agregar tareas | Convenio abierto | 📋 + Agregar Actividad |
| Subir comprobante | Actividad | 📎 + Drag & Drop |
| Validar cumplimiento | Reportes | ✅ Nueva Revisión |
| Ver evolución | Reportes | 📊 Gráficos |
| Ver cambios | Convenio | 📜 Auditoría |
| Permitir edición | Convenio cerrado | 🔓 Reabrir |
| Ver geografía | Municipios | 🗺️ |
| Ver tareas | Actividades | 📋 Listado |
| Ver estructura | Programas | 🎯 |
| Copiar estructura | Plantillas | 📋 POA |
| Métricas vivas | Seguimiento | 📈 Gráficos |

---

**¡Ahora entiendes toda la aplicación! 🎉**

