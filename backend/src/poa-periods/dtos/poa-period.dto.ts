import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PoaPeriodStatus } from '../entities/poa-period.entity';

export class CreatePoaPeriodDto {
  @ApiProperty({ example: 2024 })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 'uuid-of-agreement' })
  @IsUUID()
  @IsNotEmpty()
  agreementId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePoaPeriodDto {
  @ApiProperty({ required: false })
  @IsEnum(PoaPeriodStatus)
  @IsOptional()
  status?: PoaPeriodStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class AssignSupervisorToPoaDto {
  @ApiProperty({ example: 'uuid-of-supervisor' })
  @IsUUID()
  @IsNotEmpty()
  supervisorId: string;
}

export class PoaPeriodFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  agreementId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({ required: false })
  @IsEnum(PoaPeriodStatus)
  @IsOptional()
  status?: PoaPeriodStatus;

  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  limit?: number;
}

export class PoaPeriodResponseDto {
  id: string;
  year: number;
  status: PoaPeriodStatus;
  agreementId: string;
  supervisorId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
