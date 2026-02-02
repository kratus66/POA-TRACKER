import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipality } from './entities/municipality.entity';
import { Department } from '../departments/entities/department.entity';
import {
  CreateMunicipalityDto,
  UpdateMunicipalityDto,
  MunicipalityFilterDto,
} from './dtos/municipality.dto';

@Injectable()
export class MunicipalitiesService {
  constructor(
    @InjectRepository(Municipality)
    private municipalityRepository: Repository<Municipality>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createMunicipalityDto: CreateMunicipalityDto) {
    const existingMunicipality = await this.municipalityRepository.findOne({
      where: { code: createMunicipalityDto.code },
    });

    if (existingMunicipality) {
      throw new BadRequestException(
        `Municipio con código ${createMunicipalityDto.code} ya existe`,
      );
    }

    const municipality = this.municipalityRepository.create(
      createMunicipalityDto,
    );
    return this.municipalityRepository.save(municipality);
  }

  async findAll(filterDto: MunicipalityFilterDto) {
    const { search, departmentId, page = 1, limit = 10 } = filterDto;
    const query = this.municipalityRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.department', 'department');

    if (departmentId) {
      const dept = await this.departmentRepository.findOne({ where: { id: departmentId } });
      const totalByDept = await this.municipalityRepository.count({
        where: { departmentId, active: true },
      });
      console.log(
        `[MunicipalitiesService] departmentId=${departmentId} ` +
          `exists=${!!dept} ` +
          `deptName=${dept?.name || 'N/A'} ` +
          `activeMunicipalities=${totalByDept}`,
      );
    }

    if (search) {
      query.where('m.name ILIKE :search OR m.code ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (departmentId) {
      query.andWhere('m.departmentId = :departmentId', { departmentId });
    }

    query.andWhere('m.active = :active', { active: true });

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit).orderBy('m.name', 'ASC');

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const municipality = await this.municipalityRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!municipality) {
      throw new BadRequestException(`Municipio con ID ${id} no encontrado`);
    }

    return municipality;
  }

  async update(id: string, updateMunicipalityDto: UpdateMunicipalityDto) {
    await this.findById(id);

    await this.municipalityRepository.update(id, updateMunicipalityDto);

    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);

    await this.municipalityRepository.update(id, { active: false });

    return { message: 'Municipio desactivado exitosamente' };
  }

  async getDepartments() {
    return this.departmentRepository.find({
      where: { active: true },
      order: { name: 'ASC' },
      select: ['id', 'name'],
    });
  }
}
