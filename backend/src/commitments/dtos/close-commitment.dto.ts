import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CloseCommitmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  closureNotes?: string;
}
