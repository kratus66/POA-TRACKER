# 🎯 CHECKLIST VISUAL - Sprint 3 Testing

## 📋 ¿Qué Necesitas?

```
☐ Docker Desktop instalado
  └─ Si no: Descarga desde https://www.docker.com/products/docker-desktop
  
☐ Terminal (CMD, PowerShell, o Git Bash)
  
☐ Este proyecto en: c:/Users/Usuario/Documents/POA TRACKER
```

---

## 🚀 LOS 3 COMANDOS QUE NECESITAS

### Comando 1: Iniciar Servicios (30 segundos)
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER" && docker-compose up -d
```
✅ **Resultado:** Todos los servicios corriendo
- PostgreSQL (puerto 5434)
- Backend (puerto 4000)
- Frontend (puerto 3000)
- PgAdmin (puerto 5051)

---

### Comando 2: Esperar (30 segundos)
```bash
sleep 30
```
✅ **Resultado:** Sistema completamente inicializado

---

### Comando 3: Ejecutar Tests (3 minutos)
```bash
bash run-tests.sh
```

**Resultado esperado:**
```
═══════════════════════════════════════════════════════
   🧪 Sprint 3 - POA Tracker Testing Suite
═══════════════════════════════════════════════════════

[TEST 1] Health Check
✓ PASSED

[TEST 2] Authentication (Login)
✓ PASSED

[TEST 3] GET /programs
✓ PASSED

[TEST 4] POST /poa-templates (Create Template)
✓ PASSED

[TEST 5] POST /poa-templates/:id/activities
✓ PASSED

[TEST 6] GET /poa-templates/:id
✓ PASSED

[TEST 7] GET /agreements
✓ PASSED

[TEST 8] POST /agreements/:id/apply-template/:templateId ⭐ CRITICAL
✓ PASSED

[TEST 9] GET /agreement-activities
✓ PASSED

[TEST 10] PATCH /agreement-activities/:id
✓ PASSED

═══════════════════════════════════════════════════════
📊 Test Summary
═══════════════════════════════════════════════════════
Passed: 10
Failed: 0
Total: 10

✨ ALL TESTS PASSED! (100%)
Sprint 3 implementation verified successfully!
═══════════════════════════════════════════════════════
```

---

## 🌐 Acceso Después de Ejecutar Comandos

| Servicio | URL | Login |
|----------|-----|-------|
| **Aplicación** | http://localhost:3000 | admin@example.com / admin123 |
| **API** | http://localhost:4000 | (JWT) |
| **Database** | http://localhost:5051 | admin@poa.com / admin123 |

---

## 🧪 Pruebas Manuales en Frontend (10 minutos)

### 1. Ir a http://localhost:3000

### 2. Login
- Email: `admin@example.com`
- Password: `admin123`

### 3. Crear Plantilla
```
Menú → Plantillas POA
Click: "+ Crear Plantilla"
Nombre: "Mi Plantilla"
Descripción: "Test"
Click: Crear
```
✅ **Verificar:** Plantilla aparece en lista

### 4. Agregar Actividad
```
Click: Plantilla creada
Click: "+ Agregar Actividad"
Programa: "Renta Ciudadana"
Nombre: "Beneficiarios"
Meta: 1000
Unidad: "personas"
Click: Agregar
```
✅ **Verificar:** Actividad aparece en tabla

### 5. Aplicar Plantilla a Convenio
```
Menú → Convenios
Click: Un convenio
Sección: "Aplicar Plantilla POA"
Vigencia: "POA 2025" (o crear una)
Plantilla: "Mi Plantilla"
Click: "Aplicar Plantilla"
```
✅ **Verificar:** Mensaje "Plantilla aplicada"

### 6. Ver Actividades Agrupadas ⭐ KEY FEATURE
```
Sección: "Actividades del POA"
Selector: "POA 2025"
```
✅ **Verificar:**
- [ ] Actividades agrupadas por programa
- [ ] Encabezado: "Renta Ciudadana"
- [ ] Tabla con columnas correctas
- [ ] **Se ve como el Excel original**

### 7. Editar Actividad
```
Cambiar: Avance de 0 a 50
Cambiar: Estado a "IN_PROGRESS"
Click: "Guardar"
```
✅ **Verificar:**
- [ ] Cambios guardados
- [ ] Se ven al recargar página

---

## ✅ Verificación Final

Después de todo, verifica:

```
BACKEND TESTS:
☑ Health check responde
☑ Login funciona
☑ Programas se obtienen
☑ Plantilla se crea
☑ Actividad se agrega
☑ Template se obtiene con actividades
☑ Convenios se obtienen
☑ ⭐ Plantilla se aplica a convenio
☑ Actividades se copian correctamente
☑ Actividad se actualiza

FRONTEND TESTS:
☑ Login funciona
☑ Plantillas POA carga
☑ Crear plantilla funciona
☑ Agregar actividad funciona
☑ Detalle convenio carga
☑ Aplicar plantilla funciona
☑ ⭐ Actividades agrupadas por programa
☑ Edición de actividades funciona
☑ Cambios persisten

RESULTADO:
☑ Sprint 3 = 100% Funcional ✨
```

---

## 🆘 Si Algo No Funciona

### "Docker: Cannot find..."
```
→ Instala Docker Desktop
→ Inicia Docker Desktop
→ Espera a que diga "Docker is running"
```

### "Connection refused: 4000"
```
→ Espera 30 segundos (DB se está inicializando)
→ Verifica: docker-compose ps
→ Debe mostrar todos en "Up"
```

### "bash: run-tests.sh: command not found"
```
→ En PowerShell, usa Git Bash:
"c:/Program Files/Git/bin/bash.exe" run-tests.sh

→ O copia exacto desde una terminal bash
```

### "Invalid token"
```
→ Verifica que credenciales por defecto existan
→ Mira logs: docker-compose logs -f
→ Espera más tiempo a que DB se inicialice completamente
```

---

## 📊 Resumen Rápido

**Tiempo total:** 45-60 minutos
- Iniciar servicios: 30 seg
- Tests automáticos: 3 min
- Esperar inicialización: 30 seg
- Pruebas manuales: 10 min
- Lectura de documentación: 20-30 min

**Requisitos:**
- ✅ Docker Desktop
- ✅ Terminal
- ✅ 500 MB disco (Docker images)
- ✅ 2 GB RAM disponible

**Resultado esperado:**
- ✅ 10/10 tests pasando
- ✅ Frontend cargando
- ✅ Actividades agrupadas por programa
- ✅ Sprint 3 verificado ✨

---

## 🎯 SIGUIENTE: Elige tu Camino

### Opción A: Rápido (5 minutos)
Ejecuta directo:
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER" && \
docker-compose up -d && \
sleep 30 && \
bash run-tests.sh
```

### Opción B: Con Instrucciones (15 minutos)
Lee primero:
- `START_TESTING_NOW.md` (3 min)
- `QUICK_START_TESTING.md` (5 min)
Luego ejecuta los comandos

### Opción C: Detallado (30 minutos)
Lee todo:
- `TESTING_RESOURCES_SUMMARY.md`
- `PRUEBAS_SPRINT_3_INSTRUCCIONES.md`
Luego prueba paso a paso

### Opción D: Tutorial Completo (1-2 horas)
Lee todo lo anterior más:
- `SPRINT_3_SUMMARY.md`
- `SPRINT_3_README.md`
- `SPRINT_3_TESTING_GUIDE.md`
Estudia código y documentación

---

## 🚀 EMPEZAR AHORA

### Opción A: Copy-paste esto en terminal
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER" && docker-compose up -d && sleep 30 && bash run-tests.sh
```

### Opción B: O hazlo paso a paso
**Terminal abierta:**
```bash
cd "c:/Users/Usuario/Documents/POA TRACKER"
```

**Paso 1:**
```bash
docker-compose up -d
```

**Paso 2 (Espera 30 segundos):**
```bash
sleep 30
```

**Paso 3:**
```bash
bash run-tests.sh
```

---

**¡Eso es todo! Deberías ver ✨ ALL TESTS PASSED en unos minutos.**

¿Listo? 🚀

---

**Estado:** 🟢 LISTO PARA TESTING  
**Documentación:** ✅ COMPLETA  
**Scripts:** ✅ LISTOS  
**Sprint 3:** ✅ IMPLEMENTADO  
