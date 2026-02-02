import { IsUUID, IsEnum, IsOptional, IsNumber, IsString, IsDate, IsBoolean, Min } from 'class-validator';
import { TrackingStatus } from '../entities/activity-tracking.entity';
import { Type } from 'class-transformer';

export class CreateActivityTrackingDto {
  @IsUUID()
  validationId: string;

  @IsEnum(TrackingStatus)
  status: TrackingStatus;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantitativeValue?: number;

  @IsOptional()
  @IsString()
  quantitativeUnit?: string;

  @IsUUID()
  reviewerId: string;

  @IsDate()
  @Type(() => Date)
  trackingDate: Date;

  @IsOptional()
  @IsString()
  supportingDocumentation?: string;
}

export class UpdateActivityTrackingDto {
  @IsOptional()
  @IsEnum(TrackingStatus)
  status?: TrackingStatus;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantitativeValue?: number;

  @IsOptional()
  @IsString()
  quantitativeUnit?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsUUID()
  verifierUserId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  trackingDate?: Date;

  @IsOptional()
  @IsString()
  supportingDocumentation?: string;
}

export class BulkCreateActivityTrackingDto {
  trackings: CreateActivityTrackingDto[];
}
