import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Municipality } from '../../municipalities/entities/municipality.entity';

@Entity('departments')
@Index(['code'])
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, comment: 'Código DANE del departamento' })
  code: string;

  @Column({ unique: true, comment: 'Nombre del departamento' })
  name: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Municipality, (municipality) => municipality.department)
  municipalities: Municipality[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
