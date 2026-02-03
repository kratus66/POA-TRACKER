import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePoaThemeDto {
  @IsString()
  sheetKey: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
