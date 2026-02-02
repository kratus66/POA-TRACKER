import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoaActivity } from './entities/poa-activity.entity';
import { PoaActivitiesService } from './poa-activities.service';
import { PoaActivitiesController } from './poa-activities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PoaActivity])],
  controllers: [PoaActivitiesController],
  providers: [PoaActivitiesService],
  exports: [PoaActivitiesService],
})
export class PoaActivitiesModule {}
