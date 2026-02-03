import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommitmentsService } from './commitments.service';
import { CreateCommitmentDto } from './dtos/create-commitment.dto';
import { CloseCommitmentDto } from './dtos/close-commitment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('commitments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('commitments')
export class CommitmentsController {
  constructor(private commitmentsService: CommitmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear compromiso' })
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  async create(
    @Body() createDto: CreateCommitmentDto,
    @CurrentUser() user: any,
  ) {
    return this.commitmentsService.create(createDto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar compromisos' })
  @Roles(UserRole.COORDINATOR, UserRole.SUPERVISOR_POA, UserRole.ADMIN)
  async findAll(
    @Query('reviewCycleId') reviewCycleId?: string,
    @Query('agreementActivityId') agreementActivityId?: string,
    @Query('status') status?: string,
  ) {
    return this.commitmentsService.findAll({
      reviewCycleId,
      agreementActivityId,
      status: status as any,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener compromiso por ID' })
  @Roles(UserRole.COORDINATOR, UserRole.SUPERVISOR_POA, UserRole.ADMIN)
  async findById(@Param('id') id: string) {
    return this.commitmentsService.findById(id);
  }

  @Get('open')
  @ApiOperation({ summary: 'Listar compromisos abiertos' })
  @Roles(UserRole.COORDINATOR, UserRole.SUPERVISOR_POA, UserRole.ADMIN)
  async findOpen(@Query('reviewCycleId') reviewCycleId?: string) {
    return this.commitmentsService.findOpen(reviewCycleId);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Cerrar compromiso' })
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  async close(@Param('id') id: string, @Body() closeDto: CloseCommitmentDto) {
    return this.commitmentsService.close(id, closeDto);
  }

  @Get('previous')
  @ApiOperation({ summary: 'Compromisos de ciclos anteriores' })
  @Roles(UserRole.COORDINATOR, UserRole.SUPERVISOR_POA, UserRole.ADMIN)
  async getPrevious(
    @Query('agreementActivityId') agreementActivityId: string,
    @Query('reviewCycleId') reviewCycleId?: string,
  ) {
    return this.commitmentsService.getPreviousCycleCommitments(
      agreementActivityId,
      reviewCycleId,
    );
  }
}
