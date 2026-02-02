import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen de revisiones' })
  async getSummary(@Query('semester') semester?: string, @Query('year') year?: string) {
    return this.reportsService.getReviewSummary(
      semester ? parseInt(semester) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('municipality/:id')
  @ApiOperation({ summary: 'Obtener resumen por municipio' })
  async getMunicipalitySummary(
    @Param('id') id: string,
    @Query('semester') semester?: string,
    @Query('year') year?: string,
  ) {
    return this.reportsService.getMunicipalitySummary(
      id,
      semester ? parseInt(semester) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('agreement/:id')
  @ApiOperation({ summary: 'Obtener resumen por convenio' })
  async getAgreementSummary(
    @Param('id') id: string,
    @Query('semester') semester?: string,
    @Query('year') year?: string,
  ) {
    return this.reportsService.getAgreementSummary(
      id,
      semester ? parseInt(semester) : undefined,
      year ? parseInt(year) : undefined,
    );
  }
}
