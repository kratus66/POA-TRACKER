import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class ApproveUserDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectUserDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason: string;
}

export class UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  rejectionReason?: string;
}
