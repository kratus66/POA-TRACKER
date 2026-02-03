# 🎬 GUÍA PASO A PASO - CÓMO CONTINUAR

**Para ejecutar ahora mismo**

---

## 📹 ESCENA 1: VALIDAR QUE TODO FUNCIONA

### Acción 1: Ir al directorio backend
```bash
cd c:/Users/Usuario/Documents/"POA TRACKER"/backend
```

### Acción 2: Compilar
```bash
npm run build
```

**Resultado esperado**:
```
> poa-tracker-backend@1.0.0 build
> nest build

(Sin output significa exitoso)
```

✅ Si ves esto: Perfecto, continuamos  
❌ Si ves error: Revisa VALIDACION_FASE_1.md sección "Solución de problemas"

---

## 📹 ESCENA 2: INICIAR SERVIDOR

### Acción 3: Iniciar en desarrollo
```bash
npm run start:dev
```

**Resultado esperado**:
```
[Nest] ...  - 02/03/2026, ... [NestFactory] Starting Nest application...
[Nest] ...  - 02/03/2026, ... [TypeOrmModule] Database synchronization ...
[Nest] ...  - 02/03/2026, ... [NestApplication] Nest application successfully started
```

✅ Cuando veas "Nest application successfully started": Servidor está listo
❌ Problemas de conexión BD: Verifica archivo .env

**IMPORTANTE**: Mantén esta terminal abierta. El servidor debe seguir corriendo.

---

## 📹 ESCENA 3: EJECUTAR SEEDER (EN NUEVA TERMINAL)

### Acción 4: Abre otra terminal (nuevA)
```bash
Ctrl+Shift+` (para nueva terminal en VS Code)
O abre PowerShell/Git Bash manualmente
```

### Acción 5: Ir a la carpeta backend
```bash
cd c:/Users/Usuario/Documents/"POA TRACKER"/backend
```

### Acción 6: Ejecutar seeder
```bash
npm run seed
```

**Resultado esperado**:
```
============================================================
🌱 INICIANDO SEEDERS DE POA TRACKER
============================================================

📍 Paso 1: Seeder de Temas POA
------------------------------------------------------------
🌱 Iniciando seeder de Temas POA...
✓ Tema creado: "Recursos" (Hoja: "RECURSOS")
✓ Tema creado: "Oferta Institucional" (Hoja: "OFERTA INST")
✓ Tema creado: "Ciclo Operativo" (Hoja: "CICLO OP.")
✓ Tema creado: "Componente Social y Comunitario" (Hoja: "COMP SOC Y COM")
✓ Tema creado: "Coordinación y Seguimiento" (Hoja: "COORD Y SEG")
✅ Seeder de Temas POA completado

============================================================
✅ TODOS LOS SEEDERS EJECUTADOS EXITOSAMENTE
============================================================
```

✅ Si ves esto: ¡Perfecto! Los 5 temas están en la BD
❌ Si ves duplicados: Es normal si ejecutaste 2 veces (seeder es idempotente)

---

## 📹 ESCENA 4: VERIFICAR API CON POSTMAN

### Acción 7: Abre Postman (o usa curl)

#### PASO 1: Obtén token JWT

**Endpoint**:
```
POST http://localhost:3000/auth/login
```

**Body** (JSON):
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Resultado**: Recibes token JWT
```json
{
  "access_token": "eyJhbGc... (largo token)"
}
```

Copia este token. Lo necesitas para los siguientes requests.

#### PASO 2: Listar temas

**Endpoint**:
```
GET http://localhost:3000/poa-themes
```

**Headers**:
```
Authorization: Bearer <PEGA_TU_TOKEN_AQUI>
```

**Resultado esperado** (JSON):
```json
[
  {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "sheetKey": "RECURSOS",
    "title": "Recursos",
    "description": "Tema relacionado a recursos...",
    "active": true,
    "createdAt": "2026-02-03T14:30:00.000Z",
    "updatedAt": "2026-02-03T14:30:00.000Z"
  },
  {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "sheetKey": "OFERTA INST",
    "title": "Oferta Institucional",
    ...
  },
  ...
]
```

✅ Si ves los 5 temas: ¡Excelente!

#### PASO 3: Obtener estadísticas

**Endpoint**:
```
GET http://localhost:3000/poa-themes/stats
```

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Resultado esperado**:
```json
[
  {
    "id": "uuid",
    "title": "Recursos",
    "sheetKey": "RECURSOS",
    "poaTemplateActivitiesCount": 0,
    "agreementActivitiesCount": 0,
    "poaActivitiesCount": 0,
    "validationsCount": 0,
    "totalActivities": 0
  },
  ...
]
```

✅ Perfecto, la API funciona

---

## 📹 ESCENA 5: REVISAR EN BD

### Acción 8: Accede a tu BD (PostgreSQL)

Usa pgAdmin, DBeaver, o cliente SQL:

```sql
SELECT id, sheet_key, title, active, created_at 
FROM poa_themes 
ORDER BY title;
```

**Resultado esperado**: 5 filas con los temas

```
Recursos                          RECURSOS       true
Oferta Institucional              OFERTA INST    true
Ciclo Operativo                   CICLO OP.      true
Componente Social y Comunitario   COMP SOC Y COM true
Coordinación y Seguimiento        COORD Y SEG    true
```

✅ Perfecto, datos en BD

---

## 📹 ESCENA 6: REVISAR CÓDIGO

### Acción 9: Explorar archivos creados

En VS Code:

1. Abre: `backend/src/poa-themes/`
   - Ves 5 archivos ✅
   
2. Abre: `backend/src/poa-themes/poa-theme.entity.ts`
   - Ves entidad con 4 relaciones `@OneToMany`
   
3. Abre: `backend/src/poa-themes/poa-themes.service.ts`
   - Ves 8 métodos implementados
   
4. Abre: `backend/src/poa-themes/poa-themes.controller.ts`
   - Ves 6 endpoints con documentación Swagger

5. Abre: `backend/src/seeders/poa-themes.seeder.ts`
   - Ves mapeo de 5 temas

---

## 📹 ESCENA 7: DOCUMENTACIÓN

### Acción 10: Lee la documentación (opcional pero recomendado)

En orden de prioridad:

**Opción A - Rápido (15 min)**:
1. Lee: [RESUMEN_FASE_1.md](RESUMEN_FASE_1.md)
2. Lee: Sección "Próximo paso" en [FASE_2_PROXIMOS_PASOS.md](FASE_2_PROXIMOS_PASOS.md)

**Opción B - Completo (60 min)**:
1. Lee: [RESUMEN_FASE_1.md](RESUMEN_FASE_1.md)
2. Lee: [FASE_1_TEMAS_COMPLETADO.md](FASE_1_TEMAS_COMPLETADO.md)
3. Lee: [FASE_2_PROXIMOS_PASOS.md](FASE_2_PROXIMOS_PASOS.md)
4. Consulta: [REFERENCIA_RAPIDA_FASE_1.md](REFERENCIA_RAPIDA_FASE_1.md) cuando necesites

**Opción C - Testing (40 min)**:
1. Lee: [VALIDACION_FASE_1.md](VALIDACION_FASE_1.md)
2. Ejecuta: Todos los pasos de validación
3. Verifica: Que todo funciona

---

## 🎯 SIGUIENTE PASO: DECIDIR PRÓXIMA ACCIÓN

### OPCIÓN 1: COMENZAR FASE 2 AHORA
```
Si quieres continuar con Commitments inmediatamente:
→ Lee: FASE_2_PROXIMOS_PASOS.md
→ Confirmamos: Estructura y preguntas clave
→ Comenzamos: Implementación de Commitments
```

### OPCIÓN 2: REVISAR EN DETALLE PRIMERO
```
Si quieres entender mejor lo implementado:
→ Lee: FASE_1_TEMAS_COMPLETADO.md
→ Explora: Código fuente en VS Code
→ Pregunta: Cualquier duda
→ Luego: Comenzamos FASE 2
```

### OPCIÓN 3: HACER PRUEBAS EN DETALLE
```
Si quieres validar exhaustivamente:
→ Lee: VALIDACION_FASE_1.md
→ Ejecuta: Todos los pasos
→ Verifica: En BD, API, código
→ Luego: FASE 2
```

---

## ✅ CHECKLIST DE VALIDACIÓN RÁPIDA

```
¿El servidor inicia sin errores? ✓ → Sí / No
¿El seeder crea 5 temas? ✓ → Sí / No
¿El API lista los temas? ✓ → Sí / No
¿Los datos están en BD? ✓ → Sí / No
¿Todo compila sin errores? ✓ → Sí / No
```

Si todas las respuestas son SÍ → **FASE 1 VALIDADA ✅**

---

## 📞 PRÓXIMOS COMANDOS

Una vez validado, dirme:

**Opción A**: "FASE 1 validada, comenzar FASE 2"
**Opción B**: "Quiero revisar código primero"
**Opción C**: "Hacer pruebas exhaustivas"
**Opción D**: "Tengo una duda..."

Y continuamos 🚀

---

## 💡 TIPS IMPORTANTES

1. **Mantén ambas terminales abiertas**
   - Terminal 1: Servidor en dev (`npm run start:dev`)
   - Terminal 2: Scripts y comandos (`npm run seed`, etc)

2. **Si necesitas reiniciar servidor**
   - Presiona Ctrl+C en terminal del servidor
   - Ejecuta: `npm run start:dev` de nuevo

3. **Seeder se puede ejecutar múltiples veces**
   - No crea duplicados
   - Detecta temas existentes
   - Es seguro

4. **Token JWT expira**
   - Si después de 1 hora no funciona API
   - Obtén un nuevo token con POST /auth/login

5. **Documentación está aquí**
   - Siempre puedes consultar archivos .md
   - Están en la raíz del proyecto

---

**¿Listo para comenzar?** 🚀

Avísame cuando hayas completado ESCENAS 1-5 (validación básica) o si necesitas ayuda en algún paso.

