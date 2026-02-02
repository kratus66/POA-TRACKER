import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { AgreementActivity } from '../../agreement-activities/entities/agreement-activity.entity';
import { User } from '../../users/entities/user.entity';

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

@Entity('evidences')
export class Evidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // FK al Review (semestral)
  @ManyToOne(() => Review, (review) => review.evidences, { onDelete: 'CASCADE' })
  review: Review;

  @Column('uuid')
  reviewId: string;

  // FK a la AgreementActivity (actividad específica)
  @ManyToOne(() => AgreementActivity, (activity) => activity.evidences, {
    onDelete: 'CASCADE',
  })
  activity: AgreementActivity;

  @Column('uuid')
  activityId: string;

  // Quién cargó la evidencia
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  uploadedBy: User;

  @Column('uuid', { nullable: true })
  uploadedByUserId: string;

  // Información del archivo
  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 50 })
  fileSize: string; // ej: "2.5 MB"

  @Column({ type: 'varchar', length: 100 })
  mimeType: string; // ej: "application/pdf"

  // Clasificación del documento
  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.OTHER,
  })
  documentType: DocumentType;

  // Descripción/notas sobre la evidencia
  @Column({ type: 'text', nullable: true })
  description: string;

  // Metadatos adicionales (JSON)
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Control de acceso
  @Column({ default: true })
  isActive: boolean;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
