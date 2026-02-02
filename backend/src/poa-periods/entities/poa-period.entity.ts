import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Agreement } from '../../agreements/entities/agreement.entity';
import { User } from '../../users/entities/user.entity';
import { AgreementActivity } from '../../agreement-activities/entities/agreement-activity.entity';
import { PoaActivity } from '../../poa-activities/entities/poa-activity.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum PoaPeriodStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

@Entity('poa_periods')
@Index(['year'])
@Index(['agreementId'])
@Index(['status'])
export class PoaPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'Año de vigencia del POA' })
  year: number;

  @Column({
    type: 'enum',
    enum: PoaPeriodStatus,
    default: PoaPeriodStatus.DRAFT,
  })
  status: PoaPeriodStatus;

  @ManyToOne(() => Agreement, (agreement) => agreement.poaPeriods)
  agreement: Agreement;

  @Column()
  agreementId: string;

  @Column({ nullable: true, comment: 'Usuario supervisor asignado' })
  supervisorId?: string;

  @ManyToOne(() => User, { nullable: true })
  supervisor?: User;

  @Column({ nullable: true, comment: 'Observaciones sobre el POA' })
  notes: string;

  @OneToMany(() => AgreementActivity, (activity) => activity.poaPeriod)
  activities: AgreementActivity[];

  @OneToMany(() => PoaActivity, (activity) => activity.poaPeriod, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  poaActivities?: PoaActivity[];

  @OneToMany(() => Review, (review) => review.poaPeriod, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reviews?: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
