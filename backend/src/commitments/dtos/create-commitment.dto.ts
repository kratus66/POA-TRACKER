import { IsEnum, IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';
import { CommitmentResponsibleRole } from '../entities/commitment.entity';

export class CreateCommitmentDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  dueDate: string;

  @IsEnum(CommitmentResponsibleRole)
  responsibleRole: CommitmentResponsibleRole;

  @IsUUID()
  reviewCycleId: string;

  @IsUUID()
  agreementActivityId: string;
}
