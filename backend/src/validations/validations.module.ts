import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Validation } from './entities/validation.entity';
import { ValidationsService } from './validations.service';
import { ValidationsController } from './validations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Validation])],
  controllers: [ValidationsController],
  providers: [ValidationsService],
  exports: [ValidationsService],
})
export class ValidationsModule {}
