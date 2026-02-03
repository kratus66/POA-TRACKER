import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../programs/entities/program.entity';

/**
 * Seeder para los 4 programas principales del sistema POA
 */
@Injectable()
export class ProgramsSeeder {
  constructor(
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
  ) {}

  async seed(): Promise<void> {
    console.log('\n📋 [ProgramsSeeder] Iniciando seeder de programas...\n');

    const programs = [
      {
        name: 'Colombia Mayor',
        description:
          'Programa de protección social para el adulto mayor en situación de pobreza y vulnerabilidad',
      },
      {
        name: 'Renta Ciudadana',
        description:
          'Programa de transferencias monetarias condicionadas para familias en situación de pobreza',
      },
      {
        name: 'Compensación IVA',
        description:
          'Programa de compensación del IVA pagado en bienes y servicios básicos para población vulnerable',
      },
      {
        name: 'Renta Joven',
        description:
          'Programa de apoyo económico y acompañamiento integral para jóvenes en situación de vulnerabilidad',
      },
    ];

    let created = 0;
    let existing = 0;

    for (const programData of programs) {
      try {
        const existingProgram = await this.programRepository.findOne({
          where: { name: programData.name },
        });

        if (existingProgram) {
          console.log(`  ⚪ Programa existente: ${programData.name}`);
          existing++;
          continue;
        }

        const program = this.programRepository.create({
          ...programData,
          active: true,
        });

        await this.programRepository.save(program);
        console.log(`  ✅ Programa creado: ${programData.name}`);
        created++;
      } catch (error) {
        console.error(
          `  ❌ Error creando programa "${programData.name}":`,
          error.message,
        );
      }
    }

    console.log(`\n✅ [ProgramsSeeder COMPLETADO]`);
    console.log(`   Creados: ${created}, Existentes: ${existing}\n`);
  }
}
