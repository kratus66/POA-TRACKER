import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Agreement } from '../../agreements/entities/agreement.entity';

@Entity('municipalities')
@Index(['code'])
@Index(['name'])
@Index(['department'])
export class Municipality {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, comment: 'Código DANE del municipio' })
  code: string;

  @Column({ comment: 'Nombre del municipio' })
  name: string;

  @Column({ comment: 'Departamento' })
  department: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Agreement, (agreement) => agreement.municipality)
  agreements: Agreement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
