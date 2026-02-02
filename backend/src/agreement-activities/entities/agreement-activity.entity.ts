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
import { PoaPeriod } from '../../poa-periods/entities/poa-period.entity';
import { Program } from '../../programs/entities/program.entity';
import { Evidence } from '../../evidences/entities/evidence.entity';

@Entity('agreement_activities')
@Index(['poaPeriodId'])
@Index(['programId'])
export class AgreementActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'Nombre de la actividad' })
  name: string;

  @Column({ nullable: true, comment: 'Descripción de la actividad' })
  description: string;

  @Column({ type: 'float', nullable: true, comment: 'Meta o cantidad' })
  meta: number;

  @Column({ nullable: true, comment: 'Unidad de medida' })
  unit: string;

  @Column({
    default: 0,
    type: 'float',
    comment: 'Progreso actual de la actividad',
  })
  progress: number;

  @Column({
    type: 'varchar',
    default: 'PENDING',
    comment: 'Estado: PENDING, IN_PROGRESS, COMPLETED',
  })
  status: string;

  @ManyToOne(() => PoaPeriod, (poaPeriod) => poaPeriod.activities)
  poaPeriod: PoaPeriod;

  @Column()
  poaPeriodId: string;

  @ManyToOne(() => Program, (program) => program.agreementActivities)
  program: Program;

  @Column()
  programId: string;

  @Column({
    nullable: true,
    comment: 'ID de la actividad de plantilla original',
  })
  templateActivityId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Evidence, (evidence) => evidence.activity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  evidences?: Evidence[];
}
