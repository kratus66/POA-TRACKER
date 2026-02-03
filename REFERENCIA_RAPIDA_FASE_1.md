# ⚡ REFERENCIA RÁPIDA - FASE 1

**Para consulta rápida durante desarrollo**

---

## 🔍 BUSCAR RÁPIDO

### ¿Dónde está la entidad Theme?
```
backend/src/poa-themes/entities/poa-theme.entity.ts
```

### ¿Dónde está el servicio?
```
backend/src/poa-themes/poa-themes.service.ts
```

### ¿Dónde está el controller?
```
backend/src/poa-themes/poa-themes.controller.ts
```

### ¿Dónde está el seeder?
```
backend/src/seeders/poa-themes.seeder.ts
```

---

## 🔗 RELACIONES RÁPIDAS

### PoaTheme tiene:
```typescript
// En poa-theme.entity.ts
@OneToMany(() => PoaTemplateActivity, (a) => a.theme)
@OneToMany(() => AgreementActivity, (a) => a.theme)
@OneToMany(() => PoaActivity, (a) => a.theme)
@OneToMany(() => Validation, (v) => v.theme)
```

### Quién apunta a PoaTheme:
```
PoaTemplateActivity.themeId (FK)
AgreementActivity.themeId (FK)
PoaActivity.themeId (FK)
Validation.themeId (FK)
```

---

## 🎯 MÉTODOS DEL SERVICE

```typescript
// PoaThemesService
create(createPoaThemeDto)              // Crear
findAll(active?)                       // Listar con filtro
findById(id)                          // Por ID
findByTitle(title)                    // Por título oficial
findBySheetKey(sheetKey)              // Por clave hoja Excel
update(id, updatePoaThemeDto)         // Actualizar
remove(id)                            // Eliminar
getThemeStats()                       // Estadísticas
```

---

## 📡 ENDPOINTS

```
GET    /poa-themes
GET    /poa-themes?active=true
GET    /poa-themes/:id
GET    /poa-themes/stats
POST   /poa-themes
PATCH  /poa-themes/:id
DELETE /poa-themes/:id
```

**Todo requiere**: `Authorization: Bearer <JWT>`

---

## 5️⃣ TEMAS OFICIALES

| ID | Sheet | Título |
|----|-------|--------|
| 1 | RECURSOS | Recursos |
| 2 | OFERTA INST | Oferta Institucional |
| 3 | CICLO OP. | Ciclo Operativo |
| 4 | COMP SOC Y COM | Componente Social y Comunitario |
| 5 | COORD Y SEG | Coordinación y Seguimiento |

---

## ⚙️ SCRIPTS

```bash
npm run build       # Compilar
npm run start:dev   # Iniciar servidor
npm run seed        # Ejecutar seeder
npm run test        # Tests
npm run lint        # Linter
```

---

## 🚨 ERRORES COMUNES

### Error: Cannot find module 'poa-themes'
**Solución**: `npm run build`

### Error: Connection timeout
**Solución**: Verificar BD está corriendo

### Error: "RECURSOS" already exists
**Solución**: Normal, seeder es idempotente

### Error: Cannot delete theme with activities
**Solución**: Solo delete si `totalActivities = 0`

---

## 📝 ESTRUCTURA ENTIDAD

```typescript
@Entity('poa_themes')
@Index(['title'])
@Index(['sheetKey'])
export class PoaTheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;                          // UUID

  @Column({ unique: true })
  sheetKey: string;                    // "RECURSOS"

  @Column({ unique: true })
  title: string;                       // "Recursos"

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => PoaTemplateActivity, (a) => a.theme)
  poaTemplateActivities?: PoaTemplateActivity[];

  @OneToMany(() => AgreementActivity, (a) => a.theme)
  agreementActivities?: AgreementActivity[];

  @OneToMany(() => PoaActivity, (a) => a.theme)
  poaActivities?: PoaActivity[];

  @OneToMany(() => Validation, (v) => v.theme)
  validations?: Validation[];
}
```

---

## 📡 CURL EXAMPLES

### Listar temas
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/poa-themes
```

### Obtener uno
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/poa-themes/uuid-aqui
```

### Crear
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sheetKey":"TEST","title":"Mi Tema"}' \
  http://localhost:3000/poa-themes
```

### Actualizar
```bash
curl -X PATCH \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description":"Nueva desc"}' \
  http://localhost:3000/poa-themes/uuid
```

### Eliminar
```bash
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/poa-themes/uuid
```

### Estadísticas
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/poa-themes/stats
```

---

## 🔐 DTO CREATE

```typescript
export class CreatePoaThemeDto {
  @IsString()
  sheetKey: string;                    // "RECURSOS"

  @IsString()
  title: string;                       // "Recursos"

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
```

---

## 🔐 DTO UPDATE

```typescript
export class UpdatePoaThemeDto extends PartialType(CreatePoaThemeDto) {
  // Todos los campos son opcionales
}
```

---

## 💾 TABLAS CREADAS

```sql
CREATE TABLE poa_themes (
  id UUID PRIMARY KEY,
  sheet_key VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX(title),
  INDEX(sheet_key)
);
```

---

## ➕ COLUMNAS AGREGADAS

```sql
ALTER TABLE poa_template_activities ADD theme_id UUID;
ALTER TABLE agreement_activities ADD theme_id UUID;
ALTER TABLE poa_activities ADD theme_id UUID;
ALTER TABLE validations ADD theme_id UUID;

-- Crear índices
CREATE INDEX idx_poa_template_activities_theme_id 
  ON poa_template_activities(theme_id);
CREATE INDEX idx_agreement_activities_theme_id 
  ON agreement_activities(theme_id);
CREATE INDEX idx_poa_activities_theme_id 
  ON poa_activities(theme_id);
CREATE INDEX idx_validations_theme_id 
  ON validations(theme_id);
```

---

## 🧪 VALIDACIONES

| Campo | Validación |
|-------|-----------|
| sheetKey | Unique, not null |
| title | Unique, not null |
| description | Optional |
| active | Boolean, default: true |

---

## 📊 RESPUESTA /STATS

```json
[
  {
    "id": "uuid",
    "title": "Recursos",
    "sheetKey": "RECURSOS",
    "poaTemplateActivitiesCount": 5,
    "agreementActivitiesCount": 10,
    "poaActivitiesCount": 8,
    "validationsCount": 3,
    "totalActivities": 26
  }
]
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] Backend compila: `npm run build` ✓
- [ ] Servidor inicia: `npm run start:dev` ✓
- [ ] Seeder ejecuta: `npm run seed` ✓
- [ ] 5 temas en BD: SELECT COUNT(*) FROM poa_themes; → 5
- [ ] API responde: GET /poa-themes ✓
- [ ] DTOs validan ✓
- [ ] Relaciones existen ✓

---

## 🔗 LINKS ÚTILES

- [RESUMEN_FASE_1.md](RESUMEN_FASE_1.md) - Resumen ejecutivo
- [FASE_1_TEMAS_COMPLETADO.md](FASE_1_TEMAS_COMPLETADO.md) - Técnico
- [VALIDACION_FASE_1.md](VALIDACION_FASE_1.md) - Testing
- [FASE_2_PROXIMOS_PASOS.md](FASE_2_PROXIMOS_PASOS.md) - Roadmap

---

## 💡 TIPS

1. **Reutilizar ID de tema**: Guarda los UUIDs de los 5 temas para usar en FASE 2
2. **Seeder idempotente**: Ejecuta múltiples veces, no falla
3. **Relaciones opcionales**: themeId es nullable en tablas
4. **Índices**: Todos los campos principales tienen índices para queries rápidas
5. **Documentación**: Está en comments de código TypeORM

---

**Última actualización**: 3 febrero 2026  
**Status**: ✅ Completo  
**Siguiente**: FASE 2 - Commitments

