# ✅ Instrucciones para Ejecutar el Seeder de Actividades POA

## 📌 Estado Actual

El seeder está **correctamente configurado** y listo para ejecutarse. Sin embargo, necesitas completar un paso previo.

### ⚠️ Requisito Previo: Crear POA Period 2025

El seeder busca un **POA Period del año 2025** para asignarle las actividades. Actualmente NO existe ese período en la base de datos.

## 🎯 Opciones para Crear el POA Period 2025

### Opción 1: Desde el Frontend (Recomendado)

1. ✅ Inicia sesión como **ADMIN** o **COORDINATOR**
2. ✅ Ve al módulo de **Convenios** (`/agreements`)
3. ✅ Selecciona o crea un convenio activo
4. ✅ Dentro del convenio, crea un nuevo **Período POA** con:
   - **Año**: 2025
   - **Supervisor**: Asigna un supervisor
   - **Estado**: ACTIVE o DRAFT

### Opción 2: Crear POA Period directamente en la BD

Ejecuta este SQL en PostgreSQL:

```sql
-- Primero, obtén el ID de un convenio existente
SELECT id, "agreementNumber" FROM agreements WHERE status = 'ACTIVE' LIMIT 1;

-- Luego, obtén el ID de un supervisor
SELECT id, email, role FROM users WHERE role IN ('SUPERVISOR_POA', 'ADMIN') LIMIT 1;

-- Crea el POA Period 2025
INSERT INTO poa_periods (id, year, status, "agreementId", "supervisorId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  2025,
  'ACTIVE',
  'ID-DEL-CONVENIO-AQUI',      -- Reemplaza con el ID del convenio
  'ID-DEL-SUPERVISOR-AQUI',     -- Reemplaza con el ID del supervisor
  NOW(),
  NOW()
);
```

### Opción 3: Script rápido (Desarrollo)

Puedes ejecutar este comando SQL directo:

```bash
# Conéctate a PostgreSQL
psql -h localhost -U tu_usuario -d poa_tracker_db

# Ejecuta:
INSERT INTO poa_periods (id, year, status, "agreementId", "supervisorId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  2025,
  'ACTIVE',
  (SELECT id FROM agreements WHERE status = 'ACTIVE' LIMIT 1),
  (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1),
  NOW(),
  NOW();
```

## 🚀 Ejecutar el Seeder

Una vez creado el POA Period 2025, ejecuta:

```bash
cd backend
npm run seed
```

### 📊 Resultado Esperado

```
============================================================
🌱 INICIANDO SEEDERS DE POA TRACKER
============================================================

📍 Paso 1: Seeder de Temas POA
------------------------------------------------------------
✓ Tema "Recursos" ya existe
✓ Tema "Oferta Institucional" ya existe
✓ Tema "Ciclo Operativo" ya existe
✓ Tema "Componente Social y Comunitario" ya existe
✓ Tema "Coordinación y Seguimiento" ya existe
✅ Seeder de Temas POA completado

📍 Paso 2: Seeder de Actividades POA desde Excel
------------------------------------------------------------

📋 [PoaActivitiesSeeder] Iniciando seeder de actividades POA...

  📂 Leyendo archivo: C:\Users\Usuario\Documents\POA TRACKER\MATRIZ POA 2025 (2).xlsx
  📊 Registros encontrados: 28

  ✅ POA Period encontrado: 2025 (ID: abc-123...)

  🆕 Programa creado: Renta Ciudadana
  🔗 Tema asignado: Recursos
  ✅ Actividad creada: Acompañamiento Familiar Integral (Renta Ciudadana)
  
  🔗 Tema asignado: Oferta Institucional
  ✅ Actividad creada: Fortalecimiento de capacidades (Renta Ciudadana)
  
  ... (más actividades)

✅ [PoaActivitiesSeeder COMPLETADO]
   Creadas: 28, Existentes: 0, Errores: 0

============================================================
✅ TODOS LOS SEEDERS EJECUTADOS EXITOSAMENTE
============================================================
```

## 🔍 Verificar las Actividades Cargadas

### Desde el Frontend:

1. Ve al módulo **Actividades** (`/activities`)
2. Selecciona **POA 2025** en el selector de vigencia
3. Deberías ver las actividades **agrupadas por tema**:
   - 📂 **Recursos**
   - 📂 **Oferta Institucional**
   - 📂 **Ciclo Operativo**
   - 📂 **Componente Social y Comunitario**
   - 📂 **Coordinación y Seguimiento**

### Desde la Base de Datos:

```sql
-- Ver actividades por tema
SELECT 
  pt.title as tema,
  COUNT(*) as cantidad_actividades
FROM agreement_activities aa
JOIN poa_themes pt ON aa."themeId" = pt.id
JOIN poa_periods pp ON aa."poaPeriodId" = pp.id
WHERE pp.year = 2025
GROUP BY pt.title
ORDER BY pt.title;

-- Ver todas las actividades con tema
SELECT 
  aa.name as actividad,
  pt.title as tema,
  p.name as programa,
  aa.meta,
  aa.unit
FROM agreement_activities aa
LEFT JOIN poa_themes pt ON aa."themeId" = pt.id
JOIN programs p ON aa."programId" = p.id
JOIN poa_periods pp ON aa."poaPeriodId" = pp.id
WHERE pp.year = 2025
ORDER BY pt.title, aa.name;
```

## 📝 Notas Importantes

1. **El seeder es idempotente**: Puedes ejecutarlo múltiples veces sin crear duplicados
2. **Detecta programas**: Si el programa no existe, lo crea automáticamente
3. **Asigna temas**: Las actividades se asocian automáticamente a su tema correspondiente
4. **El archivo Excel** debe tener 28 registros según la estructura actual

## 🎨 Nueva Vista Agrupada por Temas

El frontend ahora muestra las actividades **agrupadas por tema** automáticamente:

- Botón **"🗂️ Por Tema"** para ver agrupado
- Botón **"📋 Lista"** para ver lista completa
- Búsqueda funciona en ambos modos
- Incluye contador de actividades por tema

---

**¡Listo!** Una vez creado el POA Period 2025, el seeder cargará automáticamente todas las actividades del Excel organizadas por tema. 🚀
