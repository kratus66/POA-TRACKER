import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityTracking } from './entities/activity-tracking.entity';
import { Validation } from '../validations/entities/validation.entity';
import { ActivityTrackingService } from './activity-tracking.service';
import { ActivityTrackingController } from './activity-tracking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityTracking, Validation])],
  controllers: [ActivityTrackingController],
  providers: [ActivityTrackingService],
  exports: [ActivityTrackingService],
})
export class ActivityTrackingModule {}
