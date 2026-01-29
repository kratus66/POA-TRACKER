import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { PoaTemplateActivity } from './poa-template-activity.entity';

@Entity('poa_templates')
@Index(['name'])
export class PoaTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'Nombre de la plantilla' })
  name: string;

  @Column({ nullable: true, comment: 'Descripción de la plantilla' })
  description: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => PoaTemplateActivity, (activity) => activity.poaTemplate, {
    eager: false,
  })
  activities: PoaTemplateActivity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
