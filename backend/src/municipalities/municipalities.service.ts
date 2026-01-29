import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipality } from './entities/municipality.entity';
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
    const { search, department, page = 1, limit = 10 } = filterDto;
    const query = this.municipalityRepository.createQueryBuilder('m');

    if (search) {
      query.where('m.name ILIKE :search OR m.code ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (department) {
      query.andWhere('m.department = :department', { department });
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
    const departments = await this.municipalityRepository
      .createQueryBuilder('m')
      .select('DISTINCT m.department', 'department')
      .where('m.active = :active', { active: true })
      .orderBy('m.department', 'ASC')
      .getRawMany();

    return departments.map((d) => d.department);
  }
}
