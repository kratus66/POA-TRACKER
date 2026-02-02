import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: '05', description: 'Código DANE del departamento' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Antioquia', description: 'Nombre del departamento' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class UpdateDepartmentDto {
  @ApiProperty({ example: 'Antioquia', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
