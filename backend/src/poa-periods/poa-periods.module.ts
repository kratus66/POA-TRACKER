import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoaPeriod } from './entities/poa-period.entity';
import { PoaPeriodsController } from './poa-periods.controller';
import { PoaPeriodsService } from './poa-periods.service';

@Module({
  imports: [TypeOrmModule.forFeature([PoaPeriod])],
  controllers: [PoaPeriodsController],
  providers: [PoaPeriodsService],
  exports: [PoaPeriodsService],
})
export class PoaPeriodsModule {}
