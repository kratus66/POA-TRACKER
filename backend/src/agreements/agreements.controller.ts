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
import { AgreementsService } from './agreements.service';
import {
  CreateAgreementDto,
  AgreementFilterDto,
  AssignSupervisorDto,
  UpdateAgreementDto,
} from './dtos/agreement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('agreements')
@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo convenio' })
  @ApiResponse({ status: 201, description: 'Convenio creado exitosamente' })
  async create(@Body() createAgreementDto: CreateAgreementDto) {
    return this.agreementsService.create(createAgreementDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar convenios con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de convenios' })
  async findAll(@Query() filterDto: AgreementFilterDto) {
    return this.agreementsService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener convenio por ID' })
  @ApiResponse({ status: 200, description: 'Convenio encontrado' })
  async findById(@Param('id') id: string) {
    return this.agreementsService.findById(id);
  }

  @Get('municipality/:municipalityId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener convenios por municipio' })
  @ApiResponse({ status: 200, description: 'Convenios del municipio' })
  async getByMunicipality(@Param('municipalityId') municipalityId: string) {
    return this.agreementsService.getByMunicipality(municipalityId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar convenio' })
  @ApiResponse({ status: 200, description: 'Convenio actualizado' })
  async update(
    @Param('id') id: string,
    @Body() updateAgreementDto: UpdateAgreementDto,
  ) {
    return this.agreementsService.update(id, updateAgreementDto);
  }

  @Patch(':id/assign-supervisor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.SUPERVISOR_POA)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Asignar supervisor a vigencia POA' })
  @ApiResponse({ status: 200, description: 'Supervisor asignado' })
  async assignSupervisor(
    @Param('id') id: string,
    @Body() assignSupervisorDto: AssignSupervisorDto,
  ) {
    // Este endpoint asigna supervisor a un POA Period
    // Se implementa en PoaPeriodsController
    return { message: 'Usar endpoint /poa-periods/:id/assign-supervisor' };
  }

  @Post(':id/apply-template/:templateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.SUPERVISOR_POA)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aplicar plantilla POA a convenio' })
  @ApiResponse({ status: 201, description: 'Plantilla aplicada' })
  async applyTemplate(
    @Param('id') agreementId: string,
    @Param('templateId') templateId: string,
    @Query('year') year?: string,
  ) {
    const parsedYear = year ? parseInt(year, 10) : undefined;
    return this.agreementsService.applyTemplate(
      agreementId,
      templateId,
      parsedYear,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar convenio' })
  @ApiResponse({ status: 200, description: 'Convenio eliminado' })
  async remove(@Param('id') id: string) {
    return this.agreementsService.remove(id);
  }
}
