import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMunicipalityDto {
  @ApiProperty({ example: '05001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Medellín' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-of-department' })
  @IsUUID()
  @IsNotEmpty()
  departmentId: string;
}

export class UpdateMunicipalityDto {
  @ApiProperty({ example: 'Medellín', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'uuid-of-department', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class MunicipalityFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

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

export class MunicipalityResponseDto {
  id: string;
  code: string;
  name: string;
  department: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
