import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoaTemplate } from '../poa-templates/entities/poa-template.entity';
import { PoaTemplateActivity } from '../poa-templates/entities/poa-template-activity.entity';
import { Program } from '../programs/entities/program.entity';

@Injectable()
export class PoaTemplatesSeeder {
  constructor(
    @InjectRepository(PoaTemplate)
    private poaTemplateRepository: Repository<PoaTemplate>,
    @InjectRepository(PoaTemplateActivity)
    private poaTemplateActivityRepository: Repository<PoaTemplateActivity>,
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
  ) {}

  async seed(): Promise<void> {
    console.log('\n📋 [PoaTemplatesSeeder] Iniciando seeder de plantillas POA...\n');

    // Primero asegurarse de que existan los programas
    let programs = await this.programRepository.find();
    
    if (programs.length === 0) {
      console.log('[PoaTemplatesSeeder] Creando programas iniciales...');
      const defaultPrograms = [
        { name: 'Educación', description: 'Programa de educación y formación' },
        { name: 'Salud', description: 'Programa de salud y bienestar' },
        { name: 'Infraestructura', description: 'Programa de infraestructura' },
        { name: 'Agricultura', description: 'Programa de desarrollo agrícola' },
        { name: 'Medio Ambiente', description: 'Programa de protección ambiental' },
      ];

      for (const programData of defaultPrograms) {
        const program = this.programRepository.create(programData);
        await this.programRepository.save(program);
      }

      programs = await this.programRepository.find();
    }

    // Verificar si las plantillas ya existen
    const existingTemplates = await this.poaTemplateRepository.find();
    
    if (existingTemplates.length > 0) {
      console.log(`[PoaTemplatesSeeder] Ya existen ${existingTemplates.length} plantillas. Saltando creación...`);
      return;
    }

    // Crear plantillas de ejemplo
    const templates = [
      {
        name: 'Plantilla POA 2026 - Básica',
        description: 'Plantilla básica para POA 2026 con actividades generales',
        active: true,
        activities: [
          {
            name: 'Capacitación inicial',
            description: 'Capacitación a beneficiarios',
            meta: 100,
            unit: 'personas',
            program: programs[0], // Educación
          },
          {
            name: 'Diagnóstico inicial',
            description: 'Realizar diagnóstico de situación',
            meta: 1,
            unit: 'diagnóstico',
            program: programs[0],
          },
          {
            name: 'Implementación de actividades',
            description: 'Ejecución de actividades planificadas',
            meta: 12,
            unit: 'meses',
            program: programs[0],
          },
          {
            name: 'Monitoreo y seguimiento',
            description: 'Monitoreo mensual de avances',
            meta: 12,
            unit: 'reportes',
            program: programs[0],
          },
          {
            name: 'Evaluación final',
            description: 'Evaluación de impacto al cierre',
            meta: 1,
            unit: 'evaluación',
            program: programs[0],
          },
        ],
      },
      {
        name: 'Plantilla POA 2026 - Salud',
        description: 'Plantilla especializada en actividades de salud',
        active: true,
        activities: [
          {
            name: 'Brigada de salud',
            description: 'Jornadas de atención en salud',
            meta: 6,
            unit: 'brigadas',
            program: programs[1], // Salud
          },
          {
            name: 'Vacunación',
            description: 'Campaña de vacunación',
            meta: 500,
            unit: 'personas',
            program: programs[1],
          },
          {
            name: 'Charlas educativas',
            description: 'Charlas sobre temas de salud',
            meta: 12,
            unit: 'charlas',
            program: programs[1],
          },
          {
            name: 'Seguimiento de casos',
            description: 'Seguimiento a casos identificados',
            meta: 100,
            unit: 'casos',
            program: programs[1],
          },
        ],
      },
      {
        name: 'Plantilla POA 2026 - Infraestructura',
        description: 'Plantilla para proyectos de infraestructura',
        active: true,
        activities: [
          {
            name: 'Diseño de proyecto',
            description: 'Diseño técnico del proyecto',
            meta: 1,
            unit: 'proyecto',
            program: programs[2], // Infraestructura
          },
          {
            name: 'Licitación',
            description: 'Proceso de licitación',
            meta: 1,
            unit: 'proceso',
            program: programs[2],
          },
          {
            name: 'Construcción',
            description: 'Ejecución de obras',
            meta: 1,
            unit: 'obra',
            program: programs[2],
          },
          {
            name: 'Supervisión',
            description: 'Supervisión técnica de obra',
            meta: 6,
            unit: 'meses',
            program: programs[2],
          },
          {
            name: 'Entrega final',
            description: 'Entrega y acta de cierre',
            meta: 1,
            unit: 'acta',
            program: programs[2],
          },
        ],
      },
    ];

    for (const templateData of templates) {
      const { activities, ...templateInfo } = templateData;
      
      const template = this.poaTemplateRepository.create(templateInfo);
      const savedTemplate = await this.poaTemplateRepository.save(template);

      console.log(`✅ Plantilla creada: "${savedTemplate.name}"`);

      // Crear actividades asociadas
      for (const activityData of activities) {
        const activity = this.poaTemplateActivityRepository.create({
          name: activityData.name,
          description: activityData.description,
          meta: activityData.meta,
          unit: activityData.unit,
          poaTemplateId: savedTemplate.id,
          programId: activityData.program.id,
        });
        await this.poaTemplateActivityRepository.save(activity);
      }

      console.log(`   └─ ${activities.length} actividades agregadas`);
    }

    console.log(`\n✅ [PoaTemplatesSeeder COMPLETADO] ${templates.length} plantillas creadas\n`);
  }
}
