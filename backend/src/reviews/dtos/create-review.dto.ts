import { IsUUID, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  agreementId: string;

  @IsUUID()
  poaPeriodId: string;

  @IsInt()
  @Min(1)
  @Max(2)
  semester: number;

  @IsInt()
  @Min(2020)
  year: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
