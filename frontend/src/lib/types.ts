// Types for application
export enum DocumentType {
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  EXCEL = 'EXCEL',
  WORD = 'WORD',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  OTHER = 'OTHER',
}

export enum ReviewStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

export enum TrackingStatus {
  CUMPLE = 'CUMPLE',
  NO_CUMPLE = 'NO_CUMPLE',
  NO_APLICA = 'NO_APLICA',
  PENDIENTE = 'PENDIENTE',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CLOSE = 'CLOSE',
  REOPEN = 'REOPEN',
  UPLOAD_EVIDENCE = 'UPLOAD_EVIDENCE',
}

export interface Evidence {
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
  createdAt: string;
  updatedAt: string;
}

export interface Audit {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  changes?: Record<string, any>;
  user?: { id: string; email: string };
  reason?: string;
  createdAt: string;
  success: boolean;
}
