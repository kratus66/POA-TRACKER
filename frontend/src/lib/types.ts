// Types for application
export enum UserRole {
  ADMIN = 'ADMIN',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  PROGRAM_COORDINATOR = 'PROGRAM_COORDINATOR',
  MUNICIPAL_TEAM = 'MUNICIPAL_TEAM',
}

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

// Commitments Module
export enum CommitmentStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  OVERDUE = 'OVERDUE',
}

export enum ResponsibleRole {
  MUNICIPAL_TEAM = 'MUNICIPAL_TEAM',
  PROGRAM_COORDINATOR = 'PROGRAM_COORDINATOR',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  status: CommitmentStatus;
  responsibleRole: ResponsibleRole;
  dueDate: string;
  closedAt?: string;
  reviewId: string;
  activityId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  review?: any;
  activity?: any;
  createdBy?: any;
}

// Dashboard Types
export interface DashboardKPIs {
  totalActivities: number;
  totalValidated: number;
  compliancePercentage: number;
  pendingActivities: number;
  totalCommitments: number;
  openCommitments: number;
  closedCommitments: number;
  overdueCommitments: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface ProgramBreakdown {
  programId: string;
  programName: string;
  totalActivities: number;
  cumplimiento: number;
  compliancePercentage: number;
}

export interface MunicipalityRanking {
  municipalityId: string;
  municipalityName: string;
  totalActivities: number;
  cumplimiento: number;
  compliancePercentage: number;
}

export interface CommitmentsPanel {
  currentSemester: {
    total: number;
    open: number;
    closed: number;
    overdue: number;
  };
  previousSemester: {
    total: number;
    open: number;
    closed: number;
    overdue: number;
  };
}
