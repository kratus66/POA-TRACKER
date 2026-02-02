import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ReviewFrequency } from '../entities/poa-activity.entity';

export class CreatePoaActivityDto {
  @IsUUID()
  poaPeriodId: string;

  @IsUUID()
  programId: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  verificationSource?: string;

  @IsOptional()
  @IsString()
  verificationDocumentType?: string;

  @IsOptional()
  @IsString()
  quantitativeRecordDescription?: string;

  @IsOptional()
  @IsString()
  nationalResponsible?: string;

  @IsOptional()
  @IsString()
  sourceApplication?: string;
}
