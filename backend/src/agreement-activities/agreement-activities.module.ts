import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementActivitiesService } from './agreement-activities.service';
import { AgreementActivitiesController } from './agreement-activities.controller';
import { AgreementActivity } from './entities/agreement-activity.entity';
import { Review } from '../reviews/entities/review.entity';
import { AuditsModule } from '../audits/audits.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgreementActivity, Review]),
    AuditsModule,
  ],
  providers: [AgreementActivitiesService],
  controllers: [AgreementActivitiesController],
  exports: [AgreementActivitiesService],
})
export class AgreementActivitiesModule {}
