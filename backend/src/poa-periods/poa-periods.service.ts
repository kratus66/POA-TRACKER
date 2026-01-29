import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoaPeriod } from './entities/poa-period.entity';
import {
  CreatePoaPeriodDto,
  UpdatePoaPeriodDto,
  PoaPeriodFilterDto,
  AssignSupervisorToPoaDto,
} from './dtos/poa-period.dto';

@Injectable()
export class PoaPeriodsService {
  constructor(
    @InjectRepository(PoaPeriod)
    private poaPeriodRepository: Repository<PoaPeriod>,
  ) {}

  async create(createPoaPeriodDto: CreatePoaPeriodDto) {
    // Verificar que no existe un POA para este año y acuerdo
    const existingPoaPeriod = await this.poaPeriodRepository.findOne({
      where: {
        agreementId: createPoaPeriodDto.agreementId,
        year: createPoaPeriodDto.year,
      },
    });

    if (existingPoaPeriod) {
      throw new BadRequestException(
        `Ya existe un POA para el año ${createPoaPeriodDto.year} en este convenio`,
      );
    }

    const poaPeriod = this.poaPeriodRepository.create(createPoaPeriodDto);
    return this.poaPeriodRepository.save(poaPeriod);
  }

  async findAll(filterDto: PoaPeriodFilterDto) {
    const { agreementId, year, status, page = 1, limit = 10 } = filterDto;

    const query = this.poaPeriodRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.agreement', 'a')
      .leftJoinAndSelect('a.municipality', 'm')
      .leftJoinAndSelect('p.supervisor', 's');

    if (agreementId) {
      query.where('p.agreementId = :agreementId', { agreementId });
    }

    if (year) {
      query.andWhere('p.year = :year', { year });
    }

    if (status) {
      query.andWhere('p.status = :status', { status });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit).orderBy('p.year', 'DESC');

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
    const poaPeriod = await this.poaPeriodRepository.findOne({
      where: { id },
      relations: ['agreement', 'agreement.municipality', 'supervisor'],
    });

    if (!poaPeriod) {
      throw new BadRequestException(`POA Período con ID ${id} no encontrado`);
    }

    return poaPeriod;
  }

  async update(id: string, updatePoaPeriodDto: UpdatePoaPeriodDto) {
    await this.findById(id);

    await this.poaPeriodRepository.update(id, updatePoaPeriodDto);

    return this.findById(id);
  }

  async assignSupervisor(
    id: string,
    assignSupervisorDto: AssignSupervisorToPoaDto,
  ) {
    await this.findById(id);

    await this.poaPeriodRepository.update(id, {
      supervisorId: assignSupervisorDto.supervisorId,
    });

    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);

    await this.poaPeriodRepository.delete(id);

    return { message: 'POA Período eliminado exitosamente' };
  }

  async getByAgreement(agreementId: string) {
    return this.poaPeriodRepository.find({
      where: { agreementId },
      relations: ['supervisor'],
      order: { year: 'DESC' },
    });
  }

  async getByAgreementAndYear(agreementId: string, year: number) {
    return this.poaPeriodRepository.findOne({
      where: { agreementId, year },
    });
  }

  async getLatestByAgreement(agreementId: string) {
    return this.poaPeriodRepository.findOne({
      where: { agreementId },
      order: { year: 'DESC' },
    });
  }

  async createDefaultPoaPeriods(
    agreementId: string,
    years: number[] = [2024, 2025],
  ) {
    for (const year of years) {
      try {
        await this.create({
          year,
          agreementId,
          notes: `POA para el año ${year}`,
        });
      } catch (error) {
        // Si ya existe, continuar
        console.log(`POA ${year} ya existe para acuerdo ${agreementId}`);
      }
    }
  }
}
