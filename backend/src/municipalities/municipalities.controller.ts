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
import { MunicipalitiesService } from './municipalities.service';
import {
  CreateMunicipalityDto,
  MunicipalityFilterDto,
  UpdateMunicipalityDto,
} from './dtos/municipality.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('municipalities')
@Controller('municipalities')
export class MunicipalitiesController {
  constructor(private readonly municipalitiesService: MunicipalitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo municipio' })
  @ApiResponse({ status: 201, description: 'Municipio creado exitosamente' })
  async create(@Body() createMunicipalityDto: CreateMunicipalityDto) {
    return this.municipalitiesService.create(createMunicipalityDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar municipios con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de municipios' })
  async findAll(@Query() filterDto: MunicipalityFilterDto) {
    return this.municipalitiesService.findAll(filterDto);
  }

  @Get('departments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener lista de departamentos' })
  @ApiResponse({ status: 200, description: 'Lista de departamentos' })
  async getDepartments() {
    return this.municipalitiesService.getDepartments();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener municipio por ID' })
  @ApiResponse({ status: 200, description: 'Municipio encontrado' })
  async findById(@Param('id') id: string) {
    return this.municipalitiesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar municipio' })
  @ApiResponse({ status: 200, description: 'Municipio actualizado' })
  async update(
    @Param('id') id: string,
    @Body() updateMunicipalityDto: UpdateMunicipalityDto,
  ) {
    return this.municipalitiesService.update(id, updateMunicipalityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar municipio' })
  @ApiResponse({ status: 200, description: 'Municipio desactivado' })
  async remove(@Param('id') id: string) {
    return this.municipalitiesService.remove(id);
  }
}
