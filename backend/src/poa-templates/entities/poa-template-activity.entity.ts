import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PoaTemplate } from './poa-template.entity';
import { Program } from '../../programs/entities/program.entity';
import { PoaTheme } from '../../poa-themes/entities/poa-theme.entity';

@Entity('poa_template_activities')
@Index(['poaTemplateId'])
@Index(['programId'])
@Index(['themeId'])
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
  poaTemplate: PoaTemplate;

  @Column()
  poaTemplateId: string;

  @ManyToOne(() => Program, (program) => program.poaTemplateActivities)
  program: Program;

  @Column()
  programId: string;

  @ManyToOne(() => PoaTheme, (theme) => theme.poaTemplateActivities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'themeId' })
  theme?: PoaTheme;

  @Column({ nullable: true, comment: 'ID del tema POA' })
  themeId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
