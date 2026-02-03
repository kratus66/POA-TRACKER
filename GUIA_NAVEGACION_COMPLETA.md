# 🧭 Guía de Navegación Completa - POA Tracker

**Bienvenido al Sistema POA Tracker**  
Esta guía te llevará paso a paso por todas las funcionalidades de la aplicación.

---

## 📋 ÍNDICE DE NAVEGACIÓN

1. [Inicio de Sesión](#1-inicio-de-sesión)
2. [Dashboard Principal](#2-dashboard-principal)
3. [Gestión de Programas](#3-gestión-de-programas)
4. [Gestión de Municipios](#4-gestión-de-municipios)
5. [Convenios (Agreements)](#5-convenios-agreements)
6. [Períodos POA](#6-períodos-poa)
7. [Actividades del POA](#7-actividades-del-poa)
8. [Ciclos de Revisión](#8-ciclos-de-revisión)
9. [Compromisos (Commitments)](#9-compromisos-commitments)
10. [Reportes y Estadísticas](#10-reportes-y-estadísticas)
11. [Administración de Usuarios](#11-administración-de-usuarios)

---

## 1. INICIO DE SESIÓN

### 🔐 Página: `/auth/login` o `/login`

**Primera vez en el sistema:**

```
URL: http://localhost:3000/login
```

### Credenciales por Defecto

#### Administrador
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Rol**: ADMIN (acceso total)

#### Coordinador
- **Email**: `coordinator@example.com`
- **Password**: `coord123`
- **Rol**: COORDINATOR

#### Supervisor
- **Email**: `supervisor@example.com`
- **Password**: `super123`
- **Rol**: SUPERVISOR_POA

### Pasos:
1. ✅ Ingresa tu email
2. ✅ Ingresa tu contraseña
3. ✅ Click en "Iniciar Sesión"
4. ✅ Serás redirigido al Dashboard

### ¿Qué hacer si no funciona?
- Verifica que el backend esté corriendo: `http://localhost:4000/health`
- Verifica que el frontend esté corriendo: `http://localhost:3000`
- Revisa la consola del navegador (F12) para errores

---

## 2. DASHBOARD PRINCIPAL

### 📊 Página: `/dashboard`

**Al entrar, verás:**

### Panel Superior
- **Nombre del usuario** y rol actual
- **Botón de perfil** (esquina superior derecha)
- **Menú de navegación** lateral o superior

### Tarjetas de Resumen (Cards)
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Convenios      │  │  POAs Activos   │  │  Revisiones     │
│  Total: XX      │  │  Total: XX      │  │  Pendientes: XX │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Compromisos    │  │  Municipios     │  │  Actividades    │
│  Abiertos: XX   │  │  Total: XX      │  │  Completadas: XX│
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Sección de Acciones Rápidas
- ➕ Crear nuevo convenio
- 📝 Crear período POA
- 📊 Ver reportes
- 👥 Gestionar usuarios (solo ADMIN)

### ¿Qué hacer aquí?
- **Si eres nuevo**: Comienza creando un Programa → Municipio → Convenio
- **Si ya tienes datos**: Navega a la sección que necesites

---

## 3. GESTIÓN DE PROGRAMAS

### 📁 Página: `/programs` o `/programas`

**¿Qué son los Programas?**  
Son las líneas de trabajo o proyectos principales de tu organización.

### Ver Lista de Programas
```
┌────────────────────────────────────────────────────────┐
│ Nombre        │ Descripción       │ Estado   │ Acciones│
├────────────────────────────────────────────────────────┤
│ Programa A    │ Desarrollo...     │ ACTIVO   │ 👁️ ✏️ 🗑️│
│ Programa B    │ Educación...      │ INACTIVO │ 👁️ ✏️ 🗑️│
└────────────────────────────────────────────────────────┘
```

### Crear Nuevo Programa
1. ✅ Click en botón **"➕ Nuevo Programa"**
2. ✅ Completa el formulario:
   - **Nombre**: Ej. "Programa de Desarrollo Social"
   - **Descripción**: Detalle del programa
   - **Código**: Código único (opcional)
   - **Estado**: ACTIVO / INACTIVO
3. ✅ Click en **"Guardar"**

### Acciones Disponibles
- 👁️ **Ver** detalles del programa
- ✏️ **Editar** información
- 🗑️ **Eliminar** (solo si no tiene convenios asociados)

---

## 4. GESTIÓN DE MUNICIPIOS

### 🏛️ Página: `/municipalities` o `/municipios`

**¿Qué son los Municipios?**  
Entidades territoriales que participan en los convenios.

### Ver Lista de Municipios
```
┌──────────────────────────────────────────────────────────┐
│ Municipio     │ Departamento │ Población │ Acciones      │
├──────────────────────────────────────────────────────────┤
│ La Paz        │ La Paz       │ 900,000   │ 👁️ ✏️         │
│ Cochabamba    │ Cochabamba   │ 630,000   │ 👁️ ✏️         │
└──────────────────────────────────────────────────────────┘
```

### Crear Nuevo Municipio
1. ✅ Click en **"➕ Nuevo Municipio"**
2. ✅ Completa:
   - **Nombre**: Nombre del municipio
   - **Departamento**: Seleccionar de lista
   - **Código**: Código único
   - **Población**: Número de habitantes (opcional)
   - **Información de contacto**: Email, teléfono
3. ✅ **Guardar**

### Vista de Detalle
Al hacer click en un municipio:
- Ver convenios asociados
- Ver historial de POAs
- Ver actividades completadas

---

## 5. CONVENIOS (AGREEMENTS)

### 📜 Página: `/agreements` o `/convenios`

**¿Qué es un Convenio?**  
Acuerdo entre la organización y un municipio para ejecutar un programa.

### Flujo de Creación de Convenio

#### Paso 1: Iniciar Convenio
1. ✅ Click en **"➕ Nuevo Convenio"**
2. ✅ Selecciona **Programa**
3. ✅ Selecciona **Municipio**
4. ✅ Completa información:
   ```
   ┌─────────────────────────────────────┐
   │ Título del Convenio                 │
   │ ___________________________________│
   │                                     │
   │ Fecha de Inicio: [____/____/____]  │
   │ Fecha de Fin:    [____/____/____]  │
   │                                     │
   │ Monto Total: $______________       │
   │                                     │
   │ Responsable: [Seleccionar]         │
   │                                     │
   │ Descripción:                        │
   │ ___________________________________ │
   │ ___________________________________ │
   └─────────────────────────────────────┘
   ```
5. ✅ **Guardar Borrador** o **Activar Convenio**

#### Paso 2: Agregar Actividades al Convenio
Después de crear el convenio:
1. ✅ Entra al convenio
2. ✅ Click en **"➕ Agregar Actividad"**
3. ✅ Define:
   - **Nombre de la actividad**
   - **Descripción**
   - **Indicadores** (metas a alcanzar)
   - **Presupuesto asignado**
   - **Responsable**

#### Paso 3: Estado del Convenio
- **DRAFT** (Borrador): En edición
- **ACTIVE** (Activo): En ejecución
- **COMPLETED** (Completado): Finalizado
- **CANCELLED** (Cancelado): Anulado

---

## 6. PERÍODOS POA

### 📅 Página: `/poa-periods` o `/periodos-poa`

**¿Qué es un Período POA?**  
Plan Operativo Anual - Define las actividades a ejecutar en un año específico dentro de un convenio.

### Crear Período POA

1. ✅ Desde un convenio activo, click **"Crear POA"**
2. ✅ Completa:
   ```
   ┌────────────────────────────────────┐
   │ Año: 2026                          │
   │                                    │
   │ Convenio: [Seleccionar convenio]  │
   │                                    │
   │ Supervisor: [Seleccionar usuario] │
   │                                    │
   │ Estado: DRAFT / ACTIVE             │
   │                                    │
   │ Notas:                             │
   │ __________________________________ │
   └────────────────────────────────────┘
   ```
3. ✅ **Guardar**

### Vista del POA
```
POA 2026 - Convenio: Desarrollo Municipal La Paz
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Actividades Planificadas:
┌────────────────────────────────────────────────┐
│ ✓ Actividad 1: Infraestructura      [100%]    │
│ ⏳ Actividad 2: Educación            [60%]     │
│ 📝 Actividad 3: Salud                [0%]      │
└────────────────────────────────────────────────┘

Presupuesto Total: $XXX,XXX
Ejecutado: $XX,XXX (XX%)
```

---

## 7. ACTIVIDADES DEL POA

### 📋 Página: Dentro de cada POA

**¿Qué son las Actividades POA?**  
Tareas específicas a realizar durante el año del POA.

### Crear Actividad en el POA

1. ✅ Dentro de un POA, click **"➕ Nueva Actividad"**
2. ✅ Relaciona con una **Actividad del Convenio**
3. ✅ Define:
   ```
   ┌─────────────────────────────────────────┐
   │ Actividad Base: [Seleccionar]           │
   │                                         │
   │ Meta Anual:                             │
   │ Ej: "Construir 5 escuelas"              │
   │                                         │
   │ Indicador:                              │
   │ Ej: "Número de escuelas construidas"    │
   │                                         │
   │ Presupuesto 2026: $__________          │
   │                                         │
   │ Trimestre de Ejecución:                 │
   │ ☐ Q1  ☐ Q2  ☐ Q3  ☐ Q4                 │
   │                                         │
   │ Responsable: [Seleccionar]              │
   └─────────────────────────────────────────┘
   ```
4. ✅ **Guardar**

### Estados de Actividad
- **PENDIENTE**: No iniciada
- **EN_PROGRESO**: En ejecución
- **CUMPLIDA**: Completada al 100%
- **NO_CUMPLIDA**: No se alcanzó la meta

---

## 8. CICLOS DE REVISIÓN

### 🔍 Página: `/reviews` o `/revisiones`

**¿Qué es un Ciclo de Revisión?**  
Proceso periódico de evaluación del cumplimiento de actividades POA.

### Crear Ciclo de Revisión

1. ✅ Selecciona un **POA**
2. ✅ Click en **"Iniciar Revisión"**
3. ✅ Define:
   ```
   ┌──────────────────────────────────────┐
   │ Período: Trimestre 1 / 2026          │
   │                                      │
   │ Fecha Inicio: [____/____/____]      │
   │ Fecha Fin:    [____/____/____]      │
   │                                      │
   │ Tipo de Revisión:                    │
   │ ○ Trimestral                         │
   │ ○ Semestral                          │
   │ ○ Anual                              │
   │                                      │
   │ Supervisor: [Seleccionar]            │
   └──────────────────────────────────────┘
   ```
4. ✅ **Iniciar Revisión**

### Proceso de Revisión

#### Paso 1: Evaluación de Actividades
Para cada actividad del POA:
```
┌────────────────────────────────────────────────┐
│ Actividad: Construcción de Escuelas           │
├────────────────────────────────────────────────┤
│ Meta: 5 escuelas                               │
│ Ejecutado: 3 escuelas                          │
│                                                │
│ % Cumplimiento: [____] 60%                    │
│                                                │
│ Estado:                                        │
│ ○ CUMPLIDA                                     │
│ ● PARCIALMENTE_CUMPLIDA                        │
│ ○ NO_CUMPLIDA                                  │
│ ○ PENDIENTE                                    │
│                                                │
│ Observaciones:                                 │
│ ________________________________________       │
│                                                │
│ Evidencias: [📎 Subir archivos]               │
└────────────────────────────────────────────────┘
```

#### Paso 2: Guardar Evaluación
- ✅ Click **"Guardar Evaluación"**
- ✅ Sistema genera reporte automático

#### Paso 3: Cerrar Revisión
- ✅ Cuando todas las actividades estén evaluadas
- ✅ Click **"Cerrar Revisión"**
- ✅ Estado cambia a **CLOSED**

---

## 9. COMPROMISOS (COMMITMENTS)

### ✋ Página: `/commitments` o `/compromisos`

**¿Qué es un Compromiso?**  
Acción correctiva para actividades NO CUMPLIDAS o PARCIALMENTE CUMPLIDAS.

### Cuándo se Crean Compromisos

Automáticamente o manualmente cuando:
- Una actividad está **NO_CUMPLIDA**
- Una actividad está **PARCIALMENTE_CUMPLIDA**
- Se detectan desviaciones importantes

### Crear Compromiso

#### Desde la Revisión:
1. ✅ En actividad NO_CUMPLIDA, click **"Crear Compromiso"**
2. ✅ Completa:
   ```
   ┌─────────────────────────────────────────────┐
   │ Actividad: [Se carga automáticamente]       │
   │                                             │
   │ Descripción del Compromiso:                 │
   │ Ej: "Completar la construcción de las 2     │
   │      escuelas faltantes antes del Q2"       │
   │ ________________________________________    │
   │                                             │
   │ Responsable:                                │
   │ ○ REGIONAL_MANAGER                          │
   │ ○ PROGRAM_COORDINATOR                       │
   │ ● MUNICIPAL_TEAM                            │
   │                                             │
   │ Fecha de Vencimiento: [____/____/____]     │
   │                                             │
   │ Notas adicionales:                          │
   │ ________________________________________    │
   └─────────────────────────────────────────────┘
   ```
3. ✅ **Crear Compromiso**

### Gestionar Compromisos

#### Ver Compromisos Abiertos
```
┌──────────────────────────────────────────────────┐
│ Compromisos Abiertos (5)                         │
├──────────────────────────────────────────────────┤
│ 🔴 Vence: 15/03/2026 | Construcción Escuelas    │
│    Responsable: Equipo Municipal La Paz          │
│    [Ver] [Cerrar]                                │
├──────────────────────────────────────────────────┤
│ 🟡 Vence: 30/03/2026 | Programa de Capacitación │
│    Responsable: Coordinador Regional             │
│    [Ver] [Cerrar]                                │
└──────────────────────────────────────────────────┘
```

#### Cerrar un Compromiso
1. ✅ Click en **"Cerrar"** en el compromiso cumplido
2. ✅ Agrega notas de cierre:
   ```
   ┌──────────────────────────────────────┐
   │ Notas de Cierre:                     │
   │                                      │
   │ Ej: "Se completaron las 2 escuelas   │
   │      faltantes. Entregadas el        │
   │      10/03/2026. Adjuntar actas      │
   │      de entrega."                    │
   │ ___________________________________  │
   │                                      │
   │ Evidencia: [📎 Adjuntar]            │
   └──────────────────────────────────────┘
   ```
3. ✅ **Confirmar Cierre**
4. ✅ Estado cambia a **CLOSED**

### Compromisos de Ciclos Anteriores
- Ver historial completo
- Analizar patrones de incumplimiento
- Generar reportes de gestión

---

## 10. REPORTES Y ESTADÍSTICAS

### 📊 Página: `/reports` o `/reportes`

### Tipos de Reportes Disponibles

#### 1. Reporte General del Sistema
```
┌─────────────────────────────────────────┐
│ 📈 Estadísticas Generales               │
├─────────────────────────────────────────┤
│ Total Convenios: 25                     │
│ Convenios Activos: 18                   │
│                                         │
│ POAs Ejecutándose: 15                   │
│ Actividades Totales: 234                │
│ Cumplimiento Promedio: 78%              │
│                                         │
│ Compromisos Abiertos: 12                │
│ Compromisos Cerrados: 45                │
└─────────────────────────────────────────┘
```

#### 2. Reporte por Municipio
1. ✅ Selecciona **Municipio**
2. ✅ Define **Período**
3. ✅ Ver:
   - Convenios activos
   - POAs del período
   - Nivel de cumplimiento
   - Presupuesto ejecutado
   - Actividades completadas

#### 3. Reporte por Convenio
```
Convenio: Desarrollo Social - La Paz
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Período: 2026
Estado: ACTIVO

┌────────────────────────────────────┐
│ Presupuesto Total: $500,000        │
│ Ejecutado: $320,000 (64%)          │
│                                    │
│ Actividades Planificadas: 12       │
│ Actividades Cumplidas: 8           │
│ Cumplimiento: 67%                  │
│                                    │
│ Revisiones Realizadas: 2           │
│ Compromisos Generados: 4           │
│ Compromisos Cerrados: 2            │
└────────────────────────────────────┘
```

#### 4. Reporte de Cumplimiento
Gráficos y métricas:
- 📊 Gráfico de barras por trimestre
- 📈 Tendencia de cumplimiento
- 🎯 Actividades por estado
- 💰 Ejecución presupuestaria

#### 5. Exportar Reportes
- ✅ PDF - Documento formal
- ✅ Excel - Análisis de datos
- ✅ CSV - Importar a otros sistemas

---

## 11. ADMINISTRACIÓN DE USUARIOS

### 👥 Página: `/admin/users` (Solo ADMIN)

### Roles en el Sistema

#### ADMIN (Administrador)
- ✅ Acceso total
- ✅ Gestionar usuarios
- ✅ Configurar sistema
- ✅ Ver todos los reportes

#### COORDINATOR (Coordinador)
- ✅ Crear convenios y POAs
- ✅ Crear compromisos
- ✅ Cerrar compromisos
- ✅ Ver reportes de sus programas

#### SUPERVISOR_POA (Supervisor)
- ✅ Realizar revisiones
- ✅ Evaluar actividades
- ✅ Ver compromisos
- ✅ Generar reportes

#### REGIONAL_MANAGER (Gerente Regional)
- ✅ Ver convenios de su región
- ✅ Ver reportes
- ❌ No puede crear/editar

### Crear Usuario

1. ✅ Click **"➕ Nuevo Usuario"**
2. ✅ Completa:
   ```
   ┌──────────────────────────────────┐
   │ Nombre: ________________         │
   │ Apellido: ______________         │
   │                                  │
   │ Email: _________________@___.___ │
   │ Password: _______________        │
   │                                  │
   │ Rol:                             │
   │ ○ ADMIN                          │
   │ ● COORDINATOR                    │
   │ ○ SUPERVISOR_POA                 │
   │ ○ REGIONAL_MANAGER               │
   │                                  │
   │ Estado:                          │
   │ ● ACTIVE                         │
   │ ○ INACTIVE                       │
   └──────────────────────────────────┘
   ```
3. ✅ **Crear Usuario**
4. ✅ Se envía email de bienvenida (si configurado)

### Gestionar Usuarios
- Ver lista de usuarios
- Activar/Desactivar cuentas
- Cambiar roles
- Resetear contraseñas

---

## 🎯 FLUJO COMPLETO TÍPICO

### Caso de Uso: Nuevo Convenio desde Cero

#### Semana 1: Configuración Inicial
1. ✅ Login como ADMIN
2. ✅ Crear Programa
3. ✅ Crear Municipio
4. ✅ Crear usuarios (Coordinador, Supervisor)

#### Semana 2: Crear Convenio
5. ✅ Login como COORDINATOR
6. ✅ Crear Convenio
7. ✅ Agregar Actividades al convenio
8. ✅ Activar convenio

#### Mes 1: Crear POA
9. ✅ Crear POA para el año 2026
10. ✅ Agregar actividades POA vinculadas al convenio
11. ✅ Activar POA

#### Trimestre 1: Ejecución
12. ✅ Municipio ejecuta actividades
13. ✅ Sube evidencias de avance

#### Fin Trimestre 1: Revisión
14. ✅ SUPERVISOR crea ciclo de revisión
15. ✅ Evalúa cada actividad
16. ✅ Marca cumplimiento
17. ✅ Crea compromisos para actividades NO_CUMPLIDAS

#### Trimestre 2: Seguimiento
18. ✅ COORDINATOR revisa compromisos abiertos
19. ✅ Municipio cumple compromisos
20. ✅ COORDINATOR cierra compromisos

#### Fin de Año: Cierre
21. ✅ Revisión anual final
22. ✅ Generar reportes
23. ✅ Cerrar POA
24. ✅ Evaluar renovación de convenio

---

## 🆘 AYUDA Y SOPORTE

### Problemas Comunes

#### "No puedo crear un compromiso"
- ✅ Verifica que la actividad esté **NO_CUMPLIDA** o **PENDIENTE**
- ✅ Verifica que la revisión esté **ABIERTA**
- ✅ Verifica que tengas rol **COORDINATOR** o **ADMIN**

#### "No veo el botón de crear POA"
- ✅ Verifica que el convenio esté **ACTIVO**
- ✅ Verifica que tengas permisos suficientes

#### "El login no funciona"
- ✅ Verifica que el backend esté corriendo
- ✅ Verifica las credenciales
- ✅ Limpia cookies del navegador

#### "No puedo subir evidencias"
- ✅ Verifica el tamaño del archivo (máx 10MB)
- ✅ Verifica el formato (PDF, JPG, PNG)

### Contacto
- **Soporte Técnico**: soporte@poatracker.com
- **Documentación**: Ver archivos en `/docs`

---

## 🎓 MEJORES PRÁCTICAS

### 1. Organización
- Crea programas antes de convenios
- Usa nombres descriptivos
- Mantén la estructura jerárquica

### 2. POAs
- Planifica actividades realistas
- Define indicadores medibles
- Asigna presupuestos claros

### 3. Revisiones
- Haz revisiones trimestrales
- Documenta todo con evidencias
- Sé objetivo en las evaluaciones

### 4. Compromisos
- Crea compromisos específicos y medibles
- Asigna fechas de vencimiento realistas
- Haz seguimiento constante

### 5. Reportes
- Genera reportes regularmente
- Comparte con stakeholders
- Usa datos para tomar decisiones

---

## ✅ CHECKLIST DE INICIO

Para comenzar a usar el sistema correctamente:

- [ ] Login exitoso
- [ ] Dashboard cargando correctamente
- [ ] Al menos 1 Programa creado
- [ ] Al menos 1 Municipio creado
- [ ] Al menos 1 Convenio activo
- [ ] Al menos 1 POA del año actual
- [ ] Usuarios con roles asignados
- [ ] Primera revisión completada
- [ ] Primer reporte generado

---

**¡Felicidades! Ahora conoces el flujo completo de POA Tracker.**  
**Navega con confianza por la aplicación.** 🚀
