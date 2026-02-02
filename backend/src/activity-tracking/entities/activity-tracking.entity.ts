import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Validation } from '../../validations/entities/validation.entity';
import { User } from '../../users/entities/user.entity';

export enum TrackingStatus {
  CUMPLE = 'CUMPLE',
  NO_CUMPLE = 'NO_CUMPLE',
  NO_APLICA = 'NO_APLICA',
  PENDIENTE = 'PENDIENTE',
}

@Entity('activity_tracking')
@Index(['validationId'])
@Index(['reviewerId'])
@Index(['trackingDate'])
export class ActivityTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  validationId: string;

  @Column({
    type: 'enum',
    enum: TrackingStatus,
    default: TrackingStatus.PENDIENTE,
  })
  status: TrackingStatus;

  @Column({ type: 'text', nullable: true })
  observation?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantitativeValue?: number;

  @Column({ type: 'varchar', nullable: true })
  quantitativeUnit?: string; // ej: 'kg', '%', 'unidades', etc

  @Column()
  reviewerId: string;

  @Column({ type: 'date' })
  trackingDate: Date;

  @Column({ type: 'text', nullable: true })
  supportingDocumentation?: string; // URL o referencia a documentación

  @Column({ type: 'boolean', default: false })
  isVerified?: boolean;

  @Column({ type: 'uuid', nullable: true })
  verifierUserId?: string; // Usuario que verificó

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Validation, (validation) => validation.trackingHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'validationId' })
  validation?: Validation;

  @ManyToOne(() => User, (user) => user.activityTrackings, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reviewerId' })
  reviewer?: User;

  @ManyToOne(() => User, (user) => user.verifiedTrackings, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'verifierUserId' })
  verifier?: User;
}
