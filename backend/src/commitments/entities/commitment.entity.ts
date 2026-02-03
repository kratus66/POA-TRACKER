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
import { Review } from '../../reviews/entities/review.entity';
import { AgreementActivity } from '../../agreement-activities/entities/agreement-activity.entity';
import { User } from '../../users/entities/user.entity';

export enum CommitmentStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum CommitmentResponsibleRole {
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  PROGRAM_COORDINATOR = 'PROGRAM_COORDINATOR',
  MUNICIPAL_TEAM = 'MUNICIPAL_TEAM',
}

@Entity('commitments')
@Index(['reviewCycleId'])
@Index(['agreementActivityId'])
@Index(['status'])
export class Commitment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: CommitmentResponsibleRole,
  })
  responsibleRole: CommitmentResponsibleRole;

  @Column({
    type: 'enum',
    enum: CommitmentStatus,
    default: CommitmentStatus.OPEN,
  })
  status: CommitmentStatus;

  @Column({ type: 'text', nullable: true })
  closureNotes?: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  createdByUserId?: string;

  @Column({ type: 'uuid' })
  reviewCycleId: string;

  @Column({ type: 'uuid' })
  agreementActivityId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Review, (review) => review.commitments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewCycleId' })
  review?: Review;

  @ManyToOne(() => AgreementActivity, (activity) => activity.commitments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agreementActivityId' })
  agreementActivity?: AgreementActivity;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy?: User;
}
