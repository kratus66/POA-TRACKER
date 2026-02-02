import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PoaActivitiesService } from './poa-activities.service';
import { CreatePoaActivityDto } from './dtos/create-poa-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('poa-activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('poa-activities')
export class PoaActivitiesController {
  constructor(private poaActivitiesService: PoaActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva actividad POA' })
  async create(@Body() createPoaActivityDto: CreatePoaActivityDto) {
    return this.poaActivitiesService.create(createPoaActivityDto);
  }

  @Get('period/:poaPeriodId')
  @ApiOperation({ summary: 'Obtener actividades de un período POA' })
  async findByPoaPeriodId(@Param('poaPeriodId') poaPeriodId: string) {
    return this.poaActivitiesService.findByPoaPeriodId(poaPeriodId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de una actividad POA' })
  async findById(@Param('id') id: string) {
    return this.poaActivitiesService.findById(id);
  }
}
