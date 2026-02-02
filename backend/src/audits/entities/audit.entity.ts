import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  CLOSE = 'CLOSE',
  REOPEN = 'REOPEN',
  UPLOAD_EVIDENCE = 'UPLOAD_EVIDENCE',
  DELETE_EVIDENCE = 'DELETE_EVIDENCE',
}

export enum AuditEntityType {
  AGREEMENT_ACTIVITY = 'AGREEMENT_ACTIVITY',
  VALIDATION = 'VALIDATION',
  REVIEW = 'REVIEW',
  ACTIVITY_TRACKING = 'ACTIVITY_TRACKING',
  EVIDENCE = 'EVIDENCE',
}

@Entity('audits')
@Index(['entityType', 'entityId'])
@Index(['userId'])
@Index(['action'])
@Index(['createdAt'])
@Index(['entityType', 'createdAt'])
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tipo de entidad auditada
  @Column({
    type: 'enum',
    enum: AuditEntityType,
  })
  entityType: AuditEntityType;

  // ID de la entidad que se auditó
  @Column('uuid')
  entityId: string;

  // Acción realizada
  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  // Datos anteriores (antes de la acción)
  @Column({ type: 'jsonb', nullable: true })
  oldData: Record<string, any>;

  // Datos nuevos (después de la acción)
  @Column({ type: 'jsonb', nullable: true })
  newData: Record<string, any>;

  // Cambios específicos (qué campos cambiaron)
  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, { old: any; new: any }>;

  // Quién realizó la acción
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  user: User;

  @Column('uuid', { nullable: true })
  userId: string;

  // Detalles adicionales (IP, user-agent, etc)
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Razón del cambio (opcional)
  @Column({ type: 'text', nullable: true })
  reason: string;

  // Si es exitosa o falló
  @Column({ default: true })
  success: boolean;

  // Mensaje de error si falló
  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  // Timestamp de creación
  @CreateDateColumn()
  createdAt: Date;
}
