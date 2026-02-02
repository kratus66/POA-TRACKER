import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ValidationsService } from './validations.service';
import { BulkUpdateValidationDto } from './dtos/bulk-update-validation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('validations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('validations')
export class ValidationsController {
  constructor(private validationsService: ValidationsService) {}

  @Put()
  @ApiOperation({ summary: 'Actualizar validaciones en bulk' })
  async bulkUpdate(@Body() bulkUpdateDto: BulkUpdateValidationDto) {
    return this.validationsService.bulkUpdate(bulkUpdateDto);
  }
}
