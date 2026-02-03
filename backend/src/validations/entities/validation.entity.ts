import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { PoaActivity } from '../../poa-activities/entities/poa-activity.entity';
import { ActivityTracking } from '../../activity-tracking/entities/activity-tracking.entity';
import { PoaTheme } from '../../poa-themes/entities/poa-theme.entity';

export enum ValidationStatus {
  CUMPLE = 'CUMPLE',
  NO_CUMPLE = 'NO_CUMPLE',
  NO_APLICA = 'NO_APLICA',
  PENDIENTE = 'PENDIENTE',
}

@Entity('validations')
@Index(['reviewId'])
@Index(['activityId'])
@Index(['themeId'])
export class Validation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reviewId: string;

  @Column()
  activityId: string;

  @Column({
    type: 'enum',
    enum: ValidationStatus,
    default: ValidationStatus.PENDIENTE,
  })
  status: ValidationStatus;

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({ type: 'text', nullable: true })
  evidence?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Review, (review) => review.validations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewId' })
  review?: Review;

  @ManyToOne(() => PoaActivity, (activity) => activity.validations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activityId' })
  activity?: PoaActivity;

  @ManyToOne(() => PoaTheme, (theme) => theme.validations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'themeId' })
  theme?: PoaTheme;

  @Column({ nullable: true, comment: 'ID del tema POA' })
  themeId?: string;

  @OneToMany(
    () => ActivityTracking,
    (tracking) => tracking.validation,
    { cascade: true, onDelete: 'CASCADE' },
  )
  trackingHistory?: ActivityTracking[];
}
