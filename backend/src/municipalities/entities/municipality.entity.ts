import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Agreement } from '../../agreements/entities/agreement.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('municipalities')
@Index(['code'])
@Index(['name'])
export class Municipality {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, comment: 'Código DANE del municipio' })
  code: string;

  @Column({ comment: 'Nombre del municipio' })
  name: string;

  @Column({ name: 'department_id' })
  departmentId: string;

  @ManyToOne(() => Department, (department) => department.municipalities)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Agreement, (agreement) => agreement.municipality)
  agreements: Agreement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
