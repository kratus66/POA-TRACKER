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
import { PoaActivity } from '../../poa-activities/entities/poa-activity.entity';
import { Validation } from '../../validations/entities/validation.entity';

@Entity('poa_themes')
@Index(['title'])
@Index(['sheetKey'])
export class PoaTheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    comment: 'Nombre de la hoja en Excel (ej: RECURSOS, OFERTA INST, CICLO OP)',
  })
  sheetKey: string;

  @Column({
    unique: true,
    comment:
      'Título oficial del tema (uno de los 5: Recursos, Oferta Institucional, etc)',
  })
  title: string;

  @Column({ nullable: true, comment: 'Descripción del tema' })
  description: string;

  @Column({ default: true })
  active: boolean;

  // Relaciones
  @OneToMany(() => PoaTemplateActivity, (activity) => activity.theme, {
    eager: false,
  })
  poaTemplateActivities?: PoaTemplateActivity[];

  @OneToMany(() => AgreementActivity, (activity) => activity.theme, {
    eager: false,
  })
  agreementActivities?: AgreementActivity[];

  @OneToMany(() => PoaActivity, (activity) => activity.theme, {
    eager: false,
  })
  poaActivities?: PoaActivity[];

  @OneToMany(() => Validation, (validation) => validation.theme, {
    eager: false,
  })
  validations?: Validation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
