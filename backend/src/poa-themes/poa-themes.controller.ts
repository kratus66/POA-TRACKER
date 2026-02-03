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
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PoaThemesService } from './poa-themes.service';
import { CreatePoaThemeDto } from './dtos/create-poa-theme.dto';
import { UpdatePoaThemeDto } from './dtos/update-poa-theme.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('poa-themes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('poa-themes')
export class PoaThemesController {
  constructor(private poaThemesService: PoaThemesService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Crear nuevo tema POA',
    description:
      'Crear uno de los 5 temas oficiales: Recursos, Oferta Institucional, Ciclo Operativo, etc',
  })
  async create(@Body() createPoaThemeDto: CreatePoaThemeDto) {
    return this.poaThemesService.create(createPoaThemeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los temas POA' })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado activo',
  })
  async findAll(@Query('active') active?: string) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.poaThemesService.findAll(isActive);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obtener estadísticas de temas',
    description: 'Cantidad de actividades asociadas por tema',
  })
  async getStats() {
    return this.poaThemesService.getThemeStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de un tema POA' })
  async findById(@Param('id') id: string) {
    return this.poaThemesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tema POA' })
  async update(
    @Param('id') id: string,
    @Body() updatePoaThemeDto: UpdatePoaThemeDto,
  ) {
    return this.poaThemesService.update(id, updatePoaThemeDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Eliminar un tema POA',
    description:
      'Solo se puede eliminar si no tiene actividades o validaciones asociadas',
  })
  async remove(@Param('id') id: string) {
    await this.poaThemesService.remove(id);
  }
}
