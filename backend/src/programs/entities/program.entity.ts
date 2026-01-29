import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { PoaTemplateActivity } from '../../poa-templates/entities/poa-template-activity.entity';
import { AgreementActivity } from '../../agreement-activities/entities/agreement-activity.entity';

@Entity('programs')
@Index(['name'])
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, comment: 'Nombre del programa (ej: Renta Ciudadana)' })
  name: string;

  @Column({ comment: 'Descripción del programa' })
  description: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => PoaTemplateActivity, (activity) => activity.program, {
    eager: false,
  })
  poaTemplateActivities: PoaTemplateActivity[];

  @OneToMany(() => AgreementActivity, (activity) => activity.program, {
    eager: false,
  })
  agreementActivities: AgreementActivity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
