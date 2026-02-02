import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidencesService } from './evidences.service';
import { EvidencesController } from './evidences.controller';
import { Evidence } from './entities/evidence.entity';
import { Review } from '../reviews/entities/review.entity';
import { AgreementActivity } from '../agreement-activities/entities/agreement-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evidence, Review, AgreementActivity])],
  providers: [EvidencesService],
  controllers: [EvidencesController],
  exports: [EvidencesService],
})
export class EvidencesModule {}
