import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityTrackingService } from './activity-tracking.service';
import {
  CreateActivityTrackingDto,
  UpdateActivityTrackingDto,
  BulkCreateActivityTrackingDto,
} from './dtos/create-activity-tracking.dto';

@Controller('activity-tracking')
@UseGuards(JwtAuthGuard)
export class ActivityTrackingController {
  constructor(
    private readonly activityTrackingService: ActivityTrackingService,
  ) {}

  @Post()
  async create(
    @Body() createTrackingDto: CreateActivityTrackingDto,
  ) {
    return this.activityTrackingService.create(createTrackingDto);
  }

  @Post('bulk')
  async bulkCreate(@Body() bulkDto: BulkCreateActivityTrackingDto) {
    return this.activityTrackingService.bulkCreate(bulkDto);
  }

  @Get()
  async findAll(@Query('validationId') validationId?: string) {
    return this.activityTrackingService.findAll(validationId);
  }

  @Get('statistics/:validationId')
  async getStatistics(@Param('validationId') validationId: string) {
    return this.activityTrackingService.getTrackingStatistics(validationId);
  }

  @Get('history/:validationId')
  async getHistory(@Param('validationId') validationId: string) {
    return this.activityTrackingService.getTrackingHistory(validationId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.activityTrackingService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackingDto: UpdateActivityTrackingDto,
  ) {
    return this.activityTrackingService.update(id, updateTrackingDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.activityTrackingService.delete(id);
    return { message: 'Activity tracking deleted successfully' };
  }
}
