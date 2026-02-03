import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PoaThemesSeeder } from './poa-themes.seeder';
import { ProgramsSeeder } from './programs.seeder';
import { PoaActivitiesSeeder } from './poa-activities.seeder';

/**
 * Script para ejecutar seeders de la aplicación
 * Uso: npm run seed (después de agregar el script en package.json)
 */
async function runSeeders() {
  console.log('\n' + '='.repeat(60));
  console.log('🌱 INICIANDO SEEDERS DE POA TRACKER');
  console.log('='.repeat(60) + '\n');

  const app = await NestFactory.create(AppModule);

  try {
    // Ejecutar seeder de temas POA
    console.log('📍 Paso 1: Seeder de Temas POA');
    console.log('-'.repeat(60));
    const poaThemesSeeder = app.get(PoaThemesSeeder);
    await poaThemesSeeder.seed();

    // Ejecutar seeder de programas
    console.log('\n📍 Paso 2: Seeder de Programas');
    console.log('-'.repeat(60));
    const programsSeeder = app.get(ProgramsSeeder);
    await programsSeeder.seed();

    // Ejecutar seeder de actividades POA
    console.log('\n📍 Paso 3: Seeder de Actividades POA desde Excel');
    console.log('-'.repeat(60));
    const poaActivitiesSeeder = app.get(PoaActivitiesSeeder);
    await poaActivitiesSeeder.seed();

    console.log('\n' + '='.repeat(60));
    console.log('✅ TODOS LOS SEEDERS EJECUTADOS EXITOSAMENTE');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('\n❌ ERROR EN SEEDERS:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSeeders().catch((error) => {
  console.error('Error fatal en seeders:', error);
  process.exit(1);
});
