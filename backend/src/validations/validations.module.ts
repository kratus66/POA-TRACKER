import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Validation } from './entities/validation.entity';
import { Review } from '../reviews/entities/review.entity';
import { ValidationsService } from './validations.service';
import { ValidationsController } from './validations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Validation, Review])],
  controllers: [ValidationsController],
  providers: [ValidationsService],
  exports: [ValidationsService],
})
export class ValidationsModule {}
