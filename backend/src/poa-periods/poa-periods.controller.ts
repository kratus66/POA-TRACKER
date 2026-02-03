import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PoaPeriodsService } from './poa-periods.service';
import {
  CreatePoaPeriodDto,
  PoaPeriodFilterDto,
  AssignSupervisorToPoaDto,
  UpdatePoaPeriodDto,
} from './dtos/poa-period.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('poa-periods')
@Controller('poa-periods')
export class PoaPeriodsController {
  constructor(private readonly poaPeriodsService: PoaPeriodsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva vigencia POA' })
  @ApiResponse({ status: 201, description: 'Vigencia POA creada exitosamente' })
  async create(@Body() createPoaPeriodDto: CreatePoaPeriodDto) {
    return this.poaPeriodsService.create(createPoaPeriodDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar vigencias POA con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de vigencias POA' })
  async findAll(@Query() filterDto: PoaPeriodFilterDto) {
    return this.poaPeriodsService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener vigencia POA por ID' })
  @ApiResponse({ status: 200, description: 'Vigencia POA encontrada' })
  async findById(@Param('id') id: string) {
    return this.poaPeriodsService.findById(id);
  }

  @Get('agreement/:agreementId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener vigencias POA por convenio' })
  @ApiResponse({ status: 200, description: 'Vigencias POA del convenio' })
  async getByAgreement(@Param('agreementId') agreementId: string) {
    return this.poaPeriodsService.getByAgreement(agreementId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar vigencia POA' })
  @ApiResponse({ status: 200, description: 'Vigencia POA actualizada' })
  async update(
    @Param('id') id: string,
    @Body() updatePoaPeriodDto: UpdatePoaPeriodDto,
  ) {
    return this.poaPeriodsService.update(id, updatePoaPeriodDto);
  }

  @Patch(':id/assign-supervisor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.SUPERVISOR_POA)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Asignar supervisor a vigencia POA' })
  @ApiResponse({ status: 200, description: 'Supervisor asignado' })
  async assignSupervisor(
    @Param('id') id: string,
    @Body() assignSupervisorDto: AssignSupervisorToPoaDto,
  ) {
    return this.poaPeriodsService.assignSupervisor(id, assignSupervisorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar vigencia POA' })
  @ApiResponse({ status: 200, description: 'Vigencia POA eliminada' })
  async remove(@Param('id') id: string) {
    return this.poaPeriodsService.remove(id);
  }
}
