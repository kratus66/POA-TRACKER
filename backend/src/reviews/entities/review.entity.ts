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
import { Agreement } from '../../agreements/entities/agreement.entity';
import { PoaPeriod } from '../../poa-periods/entities/poa-period.entity';
import { Validation } from '../../validations/entities/validation.entity';
import { Evidence } from '../../evidences/entities/evidence.entity';
import { Commitment } from '../../commitments/entities/commitment.entity';

export enum ReviewStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

@Entity('reviews')
@Index(['agreementId'])
@Index(['poaPeriodId'])
@Index(['status'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agreementId: string;

  @Column()
  poaPeriodId: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.DRAFT,
  })
  status: ReviewStatus;

  @Column({ type: 'int' })
  semester: number; // 1 o 2

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Agreement, (agreement) => agreement.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agreementId' })
  agreement?: Agreement;

  @ManyToOne(() => PoaPeriod, (period) => period.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'poaPeriodId' })
  poaPeriod?: PoaPeriod;

  @OneToMany(() => Validation, (validation) => validation.review, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  validations?: Validation[];

  @OneToMany(() => Evidence, (evidence) => evidence.review, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  evidences?: Evidence[];

  @OneToMany(() => Commitment, (commitment) => commitment.review, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  commitments?: Commitment[];
}
