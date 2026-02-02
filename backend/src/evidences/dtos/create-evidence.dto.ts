import {
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentType } from '../entities/evidence.entity';

export class CreateEvidenceDto {
  @IsUUID()
  @IsNotEmpty()
  reviewId: string;

  @IsUUID()
  @IsNotEmpty()
  activityId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  fileSize: string; // ej: "2.5 MB"

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  mimeType: string; // ej: "application/pdf"

  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateEvidenceDto {
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class BulkUploadEvidencesDto {
  @IsUUID()
  @IsNotEmpty()
  reviewId: string;

  @IsUUID()
  @IsNotEmpty()
  activityId: string;

  evidences: CreateEvidenceDto[];
}

export class EvidenceResponseDto {
  id: string;
  reviewId: string;
  activityId: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  documentType: DocumentType;
  description?: string;
  uploadedByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}
