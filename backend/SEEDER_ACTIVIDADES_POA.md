# 📊 Seeder de Actividades POA desde Excel

## 📋 Descripción

Este seeder permite cargar automáticamente todas las actividades del POA desde el archivo Excel `MATRIZ POA 2025 (2).xlsx` directamente a la base de datos.

## 🎯 Requisitos Previos

Antes de ejecutar el seeder, asegúrate de:

1. ✅ Tener el archivo `MATRIZ POA 2025 (2).xlsx` en la raíz del proyecto
2. ✅ Tener al menos un **Convenio** creado en el sistema
3. ✅ Tener un **POA Period** para el año 2025 asociado a ese convenio
4. ✅ Tener la base de datos corriendo

### Cómo crear el POA Period necesario:

Si no tienes un POA Period 2025, créalo primero:

1. Ingresa al sistema como ADMIN o COORDINATOR
2. Ve a un convenio activo
3. Crea un nuevo POA Period para el año 2025
4. Asigna un supervisor

Alternativamente, puedes crearlo manualmente en la base de datos:

```sql
-- Ejemplo de inserción manual (ajusta los IDs según tu convenio)
INSERT INTO poa_periods (id, year, status, "agreementId", "supervisorId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  2025,
  'ACTIVE',
  'TU-CONVENIO-ID-AQUI',
  'TU-SUPERVISOR-ID-AQUI',
  NOW(),
  NOW()
);
```

## 📁 Estructura del Archivo Excel

El seeder espera que el archivo Excel tenga las siguientes columnas (pueden variar en nombre):

| Columna Esperada | Alternativas Aceptadas | Descripción |
|-----------------|------------------------|-------------|
| `ACTIVIDAD` | `Actividad`, `NOMBRE` | Nombre de la actividad (requerido) |
| `DESCRIPCION` | `Descripción`, `DETALLE` | Descripción de la actividad |
| `META` | `Meta`, `CANTIDAD` | Meta numérica a alcanzar |
| `UNIDAD` | `Unidad`, `MEDIDA` | Unidad de medida (ej: "familias", "escuelas") |
| `PROGRAMA` | `Programa` | Nombre del programa (ej: "Renta Ciudadana") |
| `TEMA` | `Tema`, `EJE` | Tema POA (opcional) |

### Ejemplo de contenido del Excel:

```
ACTIVIDAD                          | DESCRIPCION               | META | UNIDAD    | PROGRAMA         | TEMA
-----------------------------------|---------------------------|------|-----------|------------------|------------------
Entrega de subsidios               | Entrega mensual           | 1000 | familias  | RENTA CIUDADANA  | Social
Capacitación en oficios            | Talleres de formación     | 50   | personas  | RENTA JOVENES    | Capacitación
Construcción de escuelas           | Infraestructura educativa | 5    | escuelas  | EDUCACION        | Infraestructura
```

## 🚀 Cómo Ejecutar el Seeder

### Opción 1: Ejecutar todos los seeders (recomendado)

```bash
cd backend
npm run seed
```

Este comando ejecutará:
1. Seeder de Temas POA
2. **Seeder de Actividades POA desde Excel** ← Tu seeder

### Opción 2: Ejecutar solo el seeder de actividades

Si quieres ejecutar solo el seeder de actividades, modifica temporalmente `run-seeders.ts` para comentar los otros seeders.

## 🔍 ¿Qué hace el Seeder?

1. **Lee el archivo Excel** `MATRIZ POA 2025 (2).xlsx`
2. **Busca el POA Period 2025** existente en la base de datos
3. Para cada fila del Excel:
   - Extrae los datos de la actividad
   - **Busca o crea el Programa** asociado
   - Busca el Tema POA si existe
   - **Verifica si la actividad ya existe** (evita duplicados)
   - Crea la actividad con estado `PENDING` y progreso `0`

## 📊 Mapeo de Programas

El seeder incluye un mapeo de nombres de programas para estandarización:

```typescript
'RENTA CIUDADANA' → 'Renta Ciudadana'
'RENTA JOVENES' → 'Renta Jóvenes'
'EDUCACION' → 'Educación'
'SALUD' → 'Salud'
'INFRAESTRUCTURA' → 'Infraestructura'
```

Si tu Excel tiene nombres diferentes, **ajusta el mapeo** en `poa-activities.seeder.ts` línea ~60:

```typescript
const programMap: { [key: string]: string } = {
  'RENTA CIUDADANA': 'Renta Ciudadana',
  'TU_PROGRAMA_EXCEL': 'Nombre Estandarizado',
  // Agrega más según tu Excel
};
```

## ✅ Resultado Esperado

Al ejecutar el seeder verás:

```
================================================================
🌱 INICIANDO SEEDERS DE POA TRACKER
================================================================

📍 Paso 1: Seeder de Temas POA
------------------------------------------------------------
...

📍 Paso 2: Seeder de Actividades POA desde Excel
------------------------------------------------------------

📋 [PoaActivitiesSeeder] Iniciando seeder de actividades POA...

  📂 Leyendo archivo: /path/to/MATRIZ POA 2025 (2).xlsx
  📊 Registros encontrados: 150

  ✅ POA Period encontrado: 2025 (ID: abc123...)

  🆕 Programa creado: Renta Ciudadana
  ✅ Actividad creada: Entrega de subsidios (Renta Ciudadana)
  ✅ Actividad creada: Capacitación en oficios (Renta Jóvenes)
  ⚪ Actividad existente: Construcción de escuelas
  ...

✅ [PoaActivitiesSeeder COMPLETADO]
   Creadas: 120, Existentes: 30, Errores: 0

================================================================
✅ TODOS LOS SEEDERS EJECUTADOS EXITOSAMENTE
================================================================
```

## ⚠️ Solución de Problemas

### Error: "No se encontró POA Period 2025"

**Solución**: Crea un POA Period para el año 2025 primero (ver sección "Requisitos Previos")

### Error: "ENOENT: no such file or directory"

**Solución**: Verifica que el archivo `MATRIZ POA 2025 (2).xlsx` esté en la **raíz del proyecto**, no en la carpeta `backend`.

### Error: "Fila sin nombre de actividad"

**Solución**: Verifica que todas las filas del Excel tengan el campo `ACTIVIDAD` o `Actividad` completado.

### Actividades duplicadas

El seeder **previene duplicados** verificando si ya existe una actividad con el mismo:
- Nombre
- POA Period ID
- Program ID

Si el seeder reporta "Actividades existentes", significa que ya fueron cargadas anteriormente.

## 🔧 Personalización

### Cambiar las columnas del Excel

Edita el archivo `backend/src/seeders/poa-activities.seeder.ts` línea ~65:

```typescript
const activityName = row['TU_COLUMNA_NOMBRE'];
const description = row['TU_COLUMNA_DESCRIPCION'];
// etc.
```

### Cambiar el año del POA

Edita `poa-activities.seeder.ts` línea ~45:

```typescript
let poaPeriod = await poaPeriodRepository.findOne({
  where: { year: 2025 }, // ← Cambia aquí
});
```

### Asignar a un convenio específico

Si quieres asignar las actividades a un convenio específico, modifica la búsqueda del POA Period:

```typescript
let poaPeriod = await poaPeriodRepository.findOne({
  where: { 
    year: 2025,
    agreementId: 'TU-CONVENIO-ID-AQUI' 
  },
});
```

## 📝 Verificación

Después de ejecutar el seeder, verifica las actividades:

### Opción 1: Desde la UI

1. Ingresa al sistema
2. Ve al módulo **Actividades**
3. Selecciona el POA 2025
4. Deberías ver todas las actividades cargadas

### Opción 2: Desde la base de datos

```sql
SELECT 
  aa.name,
  aa.meta,
  aa.unit,
  p.name as program_name,
  pp.year as poa_year
FROM agreement_activities aa
JOIN programs p ON aa."programId" = p.id
JOIN poa_periods pp ON aa."poaPeriodId" = pp.id
WHERE pp.year = 2025
ORDER BY p.name, aa.name;
```

## 🎯 Siguientes Pasos

Después de cargar las actividades:

1. ✅ Revisa las actividades cargadas en el sistema
2. ✅ Ajusta metas o descripciones si es necesario
3. ✅ Asigna responsables a las actividades
4. ✅ Comienza el seguimiento de cumplimiento

---

**Nota**: Este seeder es **idempotente**, es decir, puedes ejecutarlo múltiples veces sin crear duplicados. Solo creará las actividades que aún no existen.
