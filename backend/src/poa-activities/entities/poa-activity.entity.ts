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
import { PoaPeriod } from '../../poa-periods/entities/poa-period.entity';
import { Program } from '../../programs/entities/program.entity';
import { Validation } from '../../validations/entities/validation.entity';
import { PoaTheme } from '../../poa-themes/entities/poa-theme.entity';

export enum ReviewFrequency {
  SEMESTRAL = 'SEMESTRAL',
  TRIMESTRAL = 'TRIMESTRAL',
  ANUAL = 'ANUAL',
}

@Entity('poa_activities')
@Index(['poaPeriodId'])
@Index(['programId'])
@Index(['themeId'])
export class PoaActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  poaPeriodId: string;

  @Column()
  programId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationSource?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationDocumentType?: string;

  @Column({ type: 'text', nullable: true })
  quantitativeRecordDescription?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nationalResponsible?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourceApplication?: string;

  @Column({
    type: 'enum',
    enum: ReviewFrequency,
    default: ReviewFrequency.SEMESTRAL,
  })
  reviewFrequency: ReviewFrequency;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => PoaPeriod, (period) => period.activities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'poaPeriodId' })
  poaPeriod?: PoaPeriod;

  @ManyToOne(() => Program, (program) => program.poaActivities, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'programId' })
  program?: Program;

  @ManyToOne(() => PoaTheme, (theme) => theme.poaActivities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'themeId' })
  theme?: PoaTheme;

  @Column({ nullable: true, comment: 'ID del tema POA' })
  themeId?: string;

  @OneToMany(() => Validation, (validation) => validation.activity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  validations?: Validation[];
}
