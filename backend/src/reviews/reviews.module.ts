import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PoaPeriodsModule } from '../poa-periods/poa-periods.module';
import { AgreementsModule } from '../agreements/agreements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    PoaPeriodsModule,
    AgreementsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
