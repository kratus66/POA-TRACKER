import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dtos/department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDto);
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { active: true },
      order: { name: 'ASC' },
      relations: ['municipalities'],
    });
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['municipalities'],
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async findByCode(code: string): Promise<Department> {
    return this.departmentRepository.findOne({
      where: { code },
      relations: ['municipalities'],
    });
  }

  async update(id: string, updateDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findById(id);
    Object.assign(department, updateDto);
    return this.departmentRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findById(id);
    await this.departmentRepository.remove(department);
  }
}
