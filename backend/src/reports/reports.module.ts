import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Review } from '../reviews/entities/review.entity';
import { Validation } from '../validations/entities/validation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Validation])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
