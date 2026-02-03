import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoaTheme } from '../poa-themes/entities/poa-theme.entity';
import { AgreementActivity } from '../agreement-activities/entities/agreement-activity.entity';
import { PoaPeriod } from '../poa-periods/entities/poa-period.entity';
import { Program } from '../programs/entities/program.entity';
import { PoaThemesSeeder } from './poa-themes.seeder';
import { PoaActivitiesSeeder } from './poa-activities.seeder';
import { ProgramsSeeder } from './programs.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PoaTheme,
      AgreementActivity,
      PoaPeriod,
      Program,
    ]),
  ],
  providers: [PoaThemesSeeder, PoaActivitiesSeeder, ProgramsSeeder],
  exports: [PoaThemesSeeder, PoaActivitiesSeeder, ProgramsSeeder],
})
export class SeederModule {}
