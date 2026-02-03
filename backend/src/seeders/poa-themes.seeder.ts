import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoaTheme } from '../poa-themes/entities/poa-theme.entity';

/**
 * Mapeo de hojas Excel a los 5 temas oficiales del POA
 * Basado en la estructura de MATRIZ_POA_2025.xlsx
 */
const THEME_MAPPING = [
  {
    sheetKey: 'RECURSOS',
    title: 'Recursos',
    description: 'Tema relacionado a recursos financieros, materiales y humanos',
  },
  {
    sheetKey: 'OFERTA INST',
    title: 'Oferta Institucional',
    description: 'Tema relacionado a la oferta y cobertura institucional',
  },
  {
    sheetKey: 'CICLO OP.',
    title: 'Ciclo Operativo',
    description: 'Tema relacionado al ciclo operativo y procesos institucionales',
  },
  {
    sheetKey: 'COMP SOC Y COM',
    title: 'Componente Social y Comunitario',
    description: 'Tema relacionado al componente social y comunitario',
  },
  {
    sheetKey: 'COORD Y SEG',
    title: 'Coordinación y Seguimiento',
    description: 'Tema relacionado a la coordinación y seguimiento de actividades',
  },
];

@Injectable()
export class PoaThemesSeeder {
  constructor(
    @InjectRepository(PoaTheme)
    private poaThemeRepository: Repository<PoaTheme>,
  ) {}

  /**
   * Ejecuta el seeder de temas POA
   * Mapea las hojas de Excel a los 5 temas oficiales
   */
  async seed(): Promise<void> {
    console.log('🌱 Iniciando seeder de Temas POA...');

    for (const themeData of THEME_MAPPING) {
      try {
        // Verificar si el tema ya existe por título
        const existingByTitle = await this.poaThemeRepository.findOne({
          where: { title: themeData.title },
        });

        if (existingByTitle) {
          console.log(`✓ Tema "${themeData.title}" ya existe`);
          continue;
        }

        // Crear nuevo tema
        const theme = this.poaThemeRepository.create({
          sheetKey: themeData.sheetKey,
          title: themeData.title,
          description: themeData.description,
          active: true,
        });

        await this.poaThemeRepository.save(theme);
        console.log(`✓ Tema creado: "${themeData.title}" (Hoja: "${themeData.sheetKey}")`);
      } catch (error) {
        console.error(
          `✗ Error creando tema "${themeData.title}":`,
          error.message,
        );
      }
    }

    console.log('✅ Seeder de Temas POA completado');
  }

  /**
   * Obtiene el ID de un tema por su título
   */
  async getThemeIdByTitle(title: string): Promise<string | null> {
    const theme = await this.poaThemeRepository.findOne({
      where: { title },
    });
    return theme?.id || null;
  }

  /**
   * Obtiene el ID de un tema por su sheetKey
   */
  async getThemeIdBySheetKey(sheetKey: string): Promise<string | null> {
    const theme = await this.poaThemeRepository.findOne({
      where: { sheetKey },
    });
    return theme?.id || null;
  }

  /**
   * Mapea un nombre de hoja Excel variable a un tema oficial
   * Útil para normalizar nombres provenientes del Excel
   */
  normalizeSheetNameToTheme(sheetName: string): {
    sheetKey: string;
    title: string;
  } | null {
    const normalized = sheetName
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Búsqueda flexible para variaciones de nombres
    for (const theme of THEME_MAPPING) {
      const themeKeyNorm = theme.sheetKey
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      if (
        normalized.includes(themeKeyNorm) ||
        themeKeyNorm.includes(normalized)
      ) {
        return {
          sheetKey: theme.sheetKey,
          title: theme.title,
        };
      }
    }

    return null;
  }
}
