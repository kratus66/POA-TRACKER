import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitmentsService } from './commitments.service';
import { CommitmentsController } from './commitments.controller';
import { Commitment } from './entities/commitment.entity';
import { Review } from '../reviews/entities/review.entity';
import { AgreementActivity } from '../agreement-activities/entities/agreement-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commitment, Review, AgreementActivity])],
  providers: [CommitmentsService],
  controllers: [CommitmentsController],
  exports: [CommitmentsService],
})
export class CommitmentsModule {}
