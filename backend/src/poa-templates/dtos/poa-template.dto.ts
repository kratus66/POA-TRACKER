import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePoaTemplateDto {
  @ApiProperty({ example: 'Plantilla Estándar 2024' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Plantilla base con actividades comunes', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePoaTemplateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePoaTemplateActivityDto {
  @ApiProperty({ example: 'Diseñar e implementar sistema de registro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Actividad para registrar ciudadanos', required: false })
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

export class PoaTemplateFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  limit?: number;
}

export class PoaTemplateResponseDto {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  activities?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class PoaTemplateActivityResponseDto {
  id: string;
  name: string;
  description?: string;
  meta?: number;
  unit?: string;
  programId: string;
  poaTemplateId: string;
  createdAt: Date;
}
