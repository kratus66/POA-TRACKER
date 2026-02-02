import { DataSource } from 'typeorm';
import { Department } from '../departments/entities/department.entity';
import { Municipality } from '../municipalities/entities/municipality.entity';
import { COLOMBIA_DEPARTMENTS, COLOMBIA_MUNICIPALITIES } from './colombia-data';

export class ColombiaSeeder {
  constructor(private dataSource: DataSource) {}

  private normalizeDeptName(value: string) {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  private async loadFallbackMunicipalities() {
    const url = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.json';
    const result = new Map<string, string[]>();

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`[ColombiaSeeder] ⚠️  No se pudo cargar fuente externa (${response.status})`);
        return result;
      }

      const data = (await response.json()) as Array<{ departamento: string; ciudades: string[] }>;
      for (const item of data) {
        const key = this.normalizeDeptName(item.departamento);
        if (!key) continue;
        result.set(key, item.ciudades || []);
      }

      console.log(`[ColombiaSeeder] ✅ Fuente externa cargada: ${result.size} departamentos`);
    } catch (error) {
      console.log(`[ColombiaSeeder] ⚠️  Error cargando fuente externa: ${error.message}`);
    }

    return result;
  }

  async run() {
    console.log('\n🔍 [ColombiaSeeder] Iniciando seeder de departamentos y municipios...\n');

    const departmentRepo = this.dataSource.getRepository(Department);
    const municipalityRepo = this.dataSource.getRepository(Municipality);

    // Seed Departments
    console.log('📋 [FASE 1] Procesando departamentos...');
    for (const deptData of COLOMBIA_DEPARTMENTS) {
      const existing = await departmentRepo.findOne({
        where: { code: deptData.code },
      });

      if (!existing) {
        const dept = departmentRepo.create(deptData);
        await departmentRepo.save(dept);
        console.log(`  ✅ Creado: ${deptData.code} - ${deptData.name}`);
      } else {
        console.log(`  ⚪ Existe: ${deptData.code} - ${deptData.name} (ID: ${existing.id})`);
      }
    }

    const deptList = await departmentRepo.find();
    const fallbackMunicipalities = await this.loadFallbackMunicipalities();
    console.log(`\n✓ Total de departamentos en BD: ${deptList.length}`);
    console.log(`  Códigos: ${deptList.map(d => d.code).join(', ')}\n`);

    // Reconcile existing municipalities by normalized DANE code (pad to 5 digits)
    console.log('📋 [FASE 2] Reconciliando municipios existentes por código DANE...');
    const normalizeCode = (code: string) => (code || '').padStart(5, '0');
    const departmentByCode = new Map(deptList.map(d => [d.code, d]));
    const allMunicipalities = await municipalityRepo.find();
    const municipalityByNormalizedCode = new Map(
      allMunicipalities.map(m => [normalizeCode(m.code), m]),
    );
    let reconciled = 0;
    let reconcileErrors = 0;

    for (const mun of allMunicipalities) {
      const normalized = normalizeCode(mun.code);
      const deptCode = normalized.substring(0, 2);
      const dept = departmentByCode.get(deptCode);

      if (!dept) {
        continue;
      }

      if (mun.departmentId !== dept.id) {
        try {
          await municipalityRepo.update(mun.id, { departmentId: dept.id });
          reconciled++;
        } catch (error) {
          reconcileErrors++;
          console.log(`  ⚠️  Error reconciliando municipio ${mun.code}: ${error.message}`);
        }
      }
    }

    console.log(`   → Reconciliados: ${reconciled}, Errores: ${reconcileErrors}`);

    // Seed Municipalities
    console.log('📋 [FASE 3] Procesando municipios...');
    let totalCreated = 0;
    let totalSkipped = 0;
    let totalUpdated = 0;
    
    for (const deptData of COLOMBIA_DEPARTMENTS) {
      const deptCode = deptData.code;
      console.log(`\n  🔎 Buscando departamento: ${deptCode}`);
      
      const department = await departmentRepo.findOne({
        where: { code: deptCode },
      });

      if (!department) {
        console.log(`  ❌ ERROR: Departamento ${deptCode} NO ENCONTRADO en BD`);
        console.log(`     Departamentos disponibles: ${deptList.map(d => d.code).join(', ')}`);
        continue;
      }

      console.log(`  ✅ Encontrado: ${department.name} (ID: ${department.id})`);

      const baseMunicipalities = COLOMBIA_MUNICIPALITIES[deptCode];
      let municipalities = baseMunicipalities;

      if (!municipalities || municipalities.length === 0) {
        const fallbackKey = this.normalizeDeptName(department.name);
        const fallbackCities = fallbackMunicipalities.get(fallbackKey) || [];
        municipalities = fallbackCities.map((name, index) => ({
          code: `${deptCode}${String(index + 1).padStart(3, '0')}`,
          name,
        }));
        console.log(`  ⚠️  Usando fuente externa para ${department.name}: ${municipalities.length} municipios`);
      }
      
      let created = 0;
      let skipped = 0;
      let updated = 0;

      for (const munData of municipalities) {
        const normalizedCode = normalizeCode(munData.code);
        const existing = municipalityByNormalizedCode.get(normalizedCode) ||
          (await municipalityRepo.findOne({
            where: { code: munData.code },
          }));

        if (!existing) {
          try {
            const municipality = municipalityRepo.create({
              ...munData,
              departmentId: department.id,
              active: true,
            });
            await municipalityRepo.save(municipality);
            created++;
          } catch (error) {
            console.log(`     ⚠️  Error creando municipio ${munData.code}: ${error.message}`);
          }
        } else {
          const needsDeptUpdate = existing.departmentId !== department.id;
          const needsActiveUpdate = existing.active !== true;
          const needsNameUpdate = existing.name !== munData.name;
          const needsCodeUpdate = normalizeCode(existing.code) !== normalizedCode;

          if (needsDeptUpdate || needsActiveUpdate || needsNameUpdate || needsCodeUpdate) {
            try {
              await municipalityRepo.update(existing.id, {
                departmentId: department.id,
                active: true,
                name: munData.name,
                code: munData.code,
              });
              updated++;
            } catch (error) {
              console.log(`     ⚠️  Error actualizando municipio ${munData.code}: ${error.message}`);
            }
          } else {
            skipped++;
          }
        }
      }

      totalCreated += created;
      totalSkipped += skipped;
      totalUpdated += updated;
      
      console.log(`     → Creados: ${created}, Actualizados: ${updated}, Existentes: ${skipped}, Total esperado: ${municipalities.length}`);
    }

    const totalDepts = await departmentRepo.count();
    const totalMuns = await municipalityRepo.count();

    console.log(`\n✅ [SEEDER COMPLETADO]`);
    console.log(`   Departamentos en BD: ${totalDepts}`);
    console.log(`   Municipios en BD: ${totalMuns}`);
    console.log(`   En esta ejecución - Creados: ${totalCreated}, Actualizados: ${totalUpdated}, Saltados: ${totalSkipped}\n`);
  }
}
