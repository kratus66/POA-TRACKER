import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
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

  @ApiProperty({ example: 'Antioquia' })
  @IsString()
  @IsNotEmpty()
  department: string;
}

export class UpdateMunicipalityDto {
  @ApiProperty({ example: 'Medellín', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Antioquia', required: false })
  @IsString()
  @IsOptional()
  department?: string;

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
  @IsString()
  department?: string;

  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @ApiProperty({ required: false, default: 10 })
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
