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
import { Municipality } from '../../municipalities/entities/municipality.entity';
import { PoaPeriod } from '../../poa-periods/entities/poa-period.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum AgreementStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

@Entity('agreements')
@Index(['agreementNumber'])
@Index(['municipalityId'])
@Index(['status'])
export class Agreement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, comment: 'Número único del convenio' })
  agreementNumber: string;

  @Column({ type: 'date', comment: 'Fecha de inicio' })
  startDate: Date;

  @Column({ type: 'date', comment: 'Fecha de vencimiento' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: AgreementStatus,
    default: AgreementStatus.ACTIVE,
  })
  status: AgreementStatus;

  @Column({ nullable: true, comment: 'Descripción o notas' })
  description: string;

  @ManyToOne(() => Municipality, (municipality) => municipality.agreements)
  municipality: Municipality;

  @Column()
  municipalityId: string;

  @OneToMany(() => PoaPeriod, (poaPeriod) => poaPeriod.agreement, {
    eager: false,
  })
  poaPeriods: PoaPeriod[];

  @OneToMany(() => Review, (review) => review.agreement, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reviews?: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
