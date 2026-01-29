import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreementActivityDto {
  @ApiProperty({ example: 'uuid-poa-period-id' })
  @IsUUID()
  @IsNotEmpty()
  poaPeriodId: string;

  @ApiProperty({ example: 'Registrar ciudadanos en el sistema' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Primera fase de registro', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 5000, required: false })
  @IsNumber()
  @IsOptional()
  meta?: number;

  @ApiProperty({ example: 'personas', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: 'uuid-program-id' })
  @IsUUID()
  @IsNotEmpty()
  programId: string;
}

export class UpdateAgreementActivityDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AgreementActivityFilterDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  poaPeriodId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  programId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  limit?: number;
}

export class AgreementActivityResponseDto {
  id: string;
  name: string;
  description?: string;
  meta?: number;
  unit?: string;
  progress: number;
  status: string;
  poaPeriodId: string;
  programId: string;
  templateActivityId?: string;
  createdAt: Date;
  updatedAt: Date;
}
