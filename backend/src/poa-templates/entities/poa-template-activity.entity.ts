import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  ForeignKey,
} from 'typeorm';
import { PoaTemplate } from './poa-template.entity';
import { Program } from '../../programs/entities/program.entity';

@Entity('poa_template_activities')
@Index(['poaTemplateId'])
@Index(['programId'])
export class PoaTemplateActivity {
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

  @ManyToOne(() => PoaTemplate, (poaTemplate) => poaTemplate.activities)
  @ForeignKey(() => PoaTemplate)
  poaTemplate: PoaTemplate;

  @Column()
  poaTemplateId: string;

  @ManyToOne(() => Program, (program) => program.poaTemplateActivities)
  @ForeignKey(() => Program)
  program: Program;

  @Column()
  programId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
