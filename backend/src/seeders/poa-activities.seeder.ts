import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { AgreementActivity } from '../agreement-activities/entities/agreement-activity.entity';
import { PoaPeriod } from '../poa-periods/entities/poa-period.entity';
import { Program } from '../programs/entities/program.entity';
import { PoaTheme } from '../poa-themes/entities/poa-theme.entity';

@Injectable()
export class PoaActivitiesSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    console.log('\n📋 [PoaActivitiesSeeder] Iniciando seeder de actividades POA...\n');

    try {
      // Leer el archivo Excel
      const excelPath = path.join(__dirname, '../../..', 'MATRIZ POA 2025 (2).xlsx');
      console.log(`  📂 Leyendo archivo: ${excelPath}`);
      
      const workbook = XLSX.readFile(excelPath);
      const sheetName = workbook.SheetNames[0]; // Primera hoja
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      console.log(`  📊 Registros encontrados: ${data.length}\n`);

      // Repositorios
      const activityRepository = this.dataSource.getRepository(AgreementActivity);
      const poaPeriodRepository = this.dataSource.getRepository(PoaPeriod);
      const programRepository = this.dataSource.getRepository(Program);
      const themeRepository = this.dataSource.getRepository(PoaTheme);

      // Obtener o crear POA Period 2025
      let poaPeriod = await poaPeriodRepository.findOne({
        where: { year: 2025 },
      });

      if (!poaPeriod) {
        console.log('  ⚠️  No se encontró POA Period 2025. Verifica que exista un convenio y crea la vigencia primero.\n');
        return;
      }

      console.log(`  ✅ POA Period encontrado: ${poaPeriod.year} (ID: ${poaPeriod.id})\n`);

      let created = 0;
      let skipped = 0;
      let errors = 0;

      // Mapeo de nombres de programas (ajusta según las columnas de tu Excel)
      const programMap: { [key: string]: string } = {
        'RENTA CIUDADANA': 'Renta Ciudadana',
        'RENTA JOVENES': 'Renta Jóvenes',
        'EDUCACION': 'Educación',
        'SALUD': 'Salud',
        'INFRAESTRUCTURA': 'Infraestructura',
        // Agrega más según tu Excel
      };

      // Mapeo de temas del Excel a los temas oficiales del sistema
      const themeMap: { [key: string]: string } = {
        'RECURSOS': 'Recursos',
        'OFERTA INST': 'Oferta Institucional',
        'OFERTA INSTITUCIONAL': 'Oferta Institucional',
        'CICLO OP': 'Ciclo Operativo',
        'CICLO OP.': 'Ciclo Operativo',
        'CICLO OPERATIVO': 'Ciclo Operativo',
        'COMP SOC Y COM': 'Componente Social y Comunitario',
        'COMPONENTE SOCIAL': 'Componente Social y Comunitario',
        'COORD Y SEG': 'Coordinación y Seguimiento',
        'COORDINACION': 'Coordinación y Seguimiento',
      };

      for (const row of data as any[]) {
        try {
          // Extraer datos del Excel (ajusta los nombres de columnas según tu archivo)
          const activityName = row['ACTIVIDAD'] || row['Actividad'] || row['NOMBRE'] || row['DESCRIPCIÓN'] || row['DESCRIPCION'];
          const description = row['DESCRIPCION'] || row['Descripción'] || row['DETALLE'] || row['OBSERVACIONES'] || '';
          const meta = parseFloat(row['META'] || row['Meta'] || row['CANTIDAD'] || 0);
          const unit = row['UNIDAD'] || row['Unidad'] || row['MEDIDA'] || 'unidad';
          
          // Detectar los programas aplicables desde las columnas del Excel
          // Buscar columnas que contengan nombres de programas
          const applicablePrograms: string[] = [];
          const programColumns = ['COMPENSACIÓN IVA', 'RENTA JOVEN', 'COLOMBIA MAYOR', 'RENTA CIUDADANA'];
          
          // Verificar en qué columnas de programas hay contenido (fuentes de verificación)
          for (const programCol of programColumns) {
            if (row[programCol] && row[programCol].toString().trim()) {
              applicablePrograms.push(programCol);
            }
          }
          
          // Si no se detectaron programas por columnas, intentar por una columna PROGRAMA
          if (applicablePrograms.length === 0) {
            const programName = row['PROGRAMA'] || row['Programa'] || 'Renta Ciudadana';
            applicablePrograms.push(programName);
          }
          
          const themeName = row['TEMA'] || row['Tema'] || row['EJE'] || row['COMPONENTE'] || null;
          const periodoCumplimiento = row['CORTES DE REVISIÓN Y CUMPLIMIENTO'] || row['PERIODO DE REGISTRO'] || null;

          if (!activityName) {
            console.log(`  ⚠️  Fila sin nombre de actividad, saltando...`);
            skipped++;
            continue;
          }

          // Buscar tema si existe
          let theme = null;
          if (themeName) {
            // Intentar mapear el nombre del tema
            const mappedThemeName = themeMap[themeName.toUpperCase()] || themeName;
            theme = await themeRepository.findOne({
              where: { title: mappedThemeName },
            });
            
            if (!theme) {
              // Buscar por sheetKey si no se encontró por title
              theme = await themeRepository.findOne({
                where: { sheetKey: themeName.toUpperCase() },
              });
            }
            
            if (theme) {
              console.log(`  🔗 Tema asignado: ${theme.title}`);
            }
          }

          // Crear una actividad por cada programa aplicable
          for (const programName of applicablePrograms) {
            try {
              // Buscar o crear programa
              const mappedProgramName = programMap[programName.toUpperCase()] || programName;
              let program = await programRepository.findOne({
                where: { name: mappedProgramName },
              });

              if (!program) {
                program = programRepository.create({
                  name: mappedProgramName,
                  description: `Programa ${mappedProgramName}`,
                  active: true,
                });
                await programRepository.save(program);
                console.log(`  🆕 Programa creado: ${mappedProgramName}`);
              }

              // Verificar si la actividad ya existe para este programa específico
              const existing = await activityRepository.findOne({
                where: {
                  name: activityName,
                  poaPeriodId: poaPeriod.id,
                  programId: program.id,
                },
              });

              if (existing) {
                console.log(`  ⚪ Actividad existente: ${activityName} (${program.name})`);
                skipped++;
                continue;
              }

              // Crear actividad para este programa
              const activity = activityRepository.create({
                name: activityName,
                description: description,
                meta: meta,
                unit: unit,
                progress: 0,
                status: 'PENDING',
                poaPeriodId: poaPeriod.id,
                programId: program.id,
                themeId: theme?.id || null,
              });

              await activityRepository.save(activity);
              console.log(`  ✅ Actividad creada: ${activityName} → ${program.name} (Tema: ${theme?.title || 'Sin tema'})`);
              created++;
            } catch (programError) {
              console.error(`  ❌ Error procesando programa ${programName}:`, programError.message);
              errors++;
            }
          }

        } catch (error) {
          console.error(`  ❌ Error procesando fila:`, error.message);
          errors++;
        }
      }

      console.log(`\n✅ [PoaActivitiesSeeder COMPLETADO]`);
      console.log(`   Creadas: ${created}, Existentes: ${skipped}, Errores: ${errors}\n`);

    } catch (error) {
      console.error(`\n❌ Error en PoaActivitiesSeeder:`, error);
      throw error;
    }
  }
}
