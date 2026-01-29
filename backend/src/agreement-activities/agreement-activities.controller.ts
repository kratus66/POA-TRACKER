import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AgreementActivitiesService } from './agreement-activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  CreateAgreementActivityDto,
  UpdateAgreementActivityDto,
  AgreementActivityFilterDto,
} from './dtos/agreement-activity.dto';

@Controller('agreement-activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgreementActivitiesController {
  constructor(
    private readonly activityService: AgreementActivitiesService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA, UserRole.COORDINATOR)
  async create(@Body() createActivityDto: CreateAgreementActivityDto) {
    return this.activityService.create(
      createActivityDto.poaPeriodId,
      createActivityDto,
    );
  }

  @Get()
  async findAll(@Query() filterDto: AgreementActivityFilterDto) {
    return this.activityService.findAll(filterDto);
  }

  @Get('period/:poaPeriodId')
  async getByPoaPeriod(@Param('poaPeriodId') poaPeriodId: string) {
    return this.activityService.getActivitiesByPoaPeriod(poaPeriodId);
  }

  @Get('period/:poaPeriodId/program/:programId')
  async getByPoaPeriodAndProgram(
    @Param('poaPeriodId') poaPeriodId: string,
    @Param('programId') programId: string,
  ) {
    return this.activityService.getActivitiesByPoaPeriodAndProgram(
      poaPeriodId,
      programId,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.activityService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA, UserRole.COORDINATOR)
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateAgreementActivityDto,
  ) {
    return this.activityService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA, UserRole.COORDINATOR)
  async remove(@Param('id') id: string) {
    return this.activityService.remove(id);
  }
}
