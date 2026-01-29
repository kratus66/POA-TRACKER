import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgreementActivity } from './entities/agreement-activity.entity';
import {
  CreateAgreementActivityDto,
  UpdateAgreementActivityDto,
  AgreementActivityFilterDto,
} from './dtos/agreement-activity.dto';

@Injectable()
export class AgreementActivitiesService {
  constructor(
    @InjectRepository(AgreementActivity)
    private activityRepository: Repository<AgreementActivity>,
  ) {}

  async create(poaPeriodId: string, createActivityDto: CreateAgreementActivityDto) {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      poaPeriodId,
      status: 'PENDING',
      progress: 0,
    });

    return this.activityRepository.save(activity);
  }

  async findAll(filterDto: AgreementActivityFilterDto) {
    const { poaPeriodId, programId, status, page = 1, limit = 10 } = filterDto;
    const query = this.activityRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.program', 'p')
      .leftJoinAndSelect('a.poaPeriod', 'pp');

    if (poaPeriodId) {
      query.where('a.poaPeriodId = :poaPeriodId', { poaPeriodId });
    }

    if (programId) {
      query.andWhere('a.programId = :programId', { programId });
    }

    if (status) {
      query.andWhere('a.status = :status', { status });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit).orderBy('a.createdAt', 'DESC');

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
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['program', 'poaPeriod'],
    });

    if (!activity) {
      throw new BadRequestException(`Actividad de acuerdo no encontrada`);
    }

    return activity;
  }

  async update(id: string, updateActivityDto: UpdateAgreementActivityDto) {
    await this.findById(id);

    await this.activityRepository.update(id, updateActivityDto);

    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);

    await this.activityRepository.delete(id);

    return { message: 'Actividad eliminada exitosamente' };
  }

  async getActivitiesByPoaPeriod(poaPeriodId: string) {
    return this.activityRepository.find({
      where: { poaPeriodId },
      relations: ['program'],
      order: { createdAt: 'DESC' },
    });
  }

  async getActivitiesByPoaPeriodAndProgram(poaPeriodId: string, programId: string) {
    return this.activityRepository.find({
      where: { poaPeriodId, programId },
      order: { createdAt: 'ASC' },
    });
  }

  async createFromTemplate(
    poaPeriodId: string,
    templateActivities: any[],
  ) {
    const createdActivities = [];

    for (const templateActivity of templateActivities) {
      const activity = this.activityRepository.create({
        name: templateActivity.name,
        description: templateActivity.description,
        meta: templateActivity.meta,
        unit: templateActivity.unit,
        programId: templateActivity.programId,
        poaPeriodId,
        templateActivityId: templateActivity.id,
        status: 'PENDING',
        progress: 0,
      });

      const saved = await this.activityRepository.save(activity);
      createdActivities.push(saved);
    }

    return createdActivities;
  }
}
