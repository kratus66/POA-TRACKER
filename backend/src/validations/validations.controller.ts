import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ValidationsService } from './validations.service';
import { BulkUpdateValidationDto } from './dtos/bulk-update-validation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('validations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('validations')
export class ValidationsController {
  constructor(private validationsService: ValidationsService) {}

  @Put()
  @ApiOperation({ summary: 'Actualizar validaciones en bulk' })
  @Roles(UserRole.COORDINATOR, UserRole.ADMIN)
  async bulkUpdate(@Body() bulkUpdateDto: BulkUpdateValidationDto) {
    return this.validationsService.bulkUpdate(bulkUpdateDto);
  }
}
