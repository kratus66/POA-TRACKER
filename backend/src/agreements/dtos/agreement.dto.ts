import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsEnum,
  IsUUID,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AgreementStatus } from '../entities/agreement.entity';
import { Type } from 'class-transformer';

export class CreateAgreementDto {
  @ApiProperty({ example: 'AGR-2024-001' })
  @IsString()
  @IsNotEmpty()
  agreementNumber: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 'ACTIVE' })
  @IsEnum(AgreementStatus)
  @IsOptional()
  status?: AgreementStatus;

  @ApiProperty({ example: 'Descripción del convenio', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-of-municipality' })
  @IsUUID()
  @IsNotEmpty()
  municipalityId: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  programIds?: string[];
}

export class UpdateAgreementDto {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsEnum(AgreementStatus)
  @IsOptional()
  status?: AgreementStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  municipalityId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  programIds?: string[];
}

export class AssignSupervisorDto {
  @ApiProperty({ example: 'uuid-of-supervisor' })
  @IsUUID()
  @IsNotEmpty()
  supervisorId: string;

  @ApiProperty({ example: 2024 })
  @IsNotEmpty()
  year: number;
}

export class AgreementFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  municipalityId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ required: false })
  @IsEnum(AgreementStatus)
  @IsOptional()
  status?: AgreementStatus;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class AgreementResponseDto {
  id: string;
  agreementNumber: string;
  startDate: Date;
  endDate: Date;
  status: AgreementStatus;
  description?: string;
  municipalityId: string;
  municipality?: {
    id: string;
    code: string;
    name: string;
    department?: {
      id: string;
      name: string;
    };
  };
  programs?: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
