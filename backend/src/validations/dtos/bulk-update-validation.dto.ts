import { IsUUID, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { ValidationStatus } from '../entities/validation.entity';

export class UpdateValidationItemDto {
  @IsUUID()
  id: string;

  @IsEnum(ValidationStatus)
  status: ValidationStatus;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsString()
  evidence?: string;
}

export class BulkUpdateValidationDto {
  @IsArray()
  validations: UpdateValidationItemDto[];
}
