import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement } from './entities/agreement.entity';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';
import { MunicipalitiesModule } from '../municipalities/municipalities.module';
import { PoaPeriodsModule } from '../poa-periods/poa-periods.module';
import { PoaTemplatesModule } from '../poa-templates/poa-templates.module';
import { AgreementActivitiesModule } from '../agreement-activities/agreement-activities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agreement]),
    MunicipalitiesModule,
    PoaPeriodsModule,
    PoaTemplatesModule,
    AgreementActivitiesModule,
  ],
  controllers: [AgreementsController],
  providers: [AgreementsService],
  exports: [AgreementsService],
})
export class AgreementsModule {}
