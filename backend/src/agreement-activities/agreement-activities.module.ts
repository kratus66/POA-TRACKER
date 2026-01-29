import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementActivitiesService } from './agreement-activities.service';
import { AgreementActivitiesController } from './agreement-activities.controller';
import { AgreementActivity } from './entities/agreement-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgreementActivity])],
  providers: [AgreementActivitiesService],
  controllers: [AgreementActivitiesController],
  exports: [AgreementActivitiesService],
})
export class AgreementActivitiesModule {}
