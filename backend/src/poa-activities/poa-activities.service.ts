import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoaActivity } from './entities/poa-activity.entity';
import { CreatePoaActivityDto } from './dtos/create-poa-activity.dto';

@Injectable()
export class PoaActivitiesService {
  constructor(
    @InjectRepository(PoaActivity)
    private poaActivityRepository: Repository<PoaActivity>,
  ) {}

  async create(createPoaActivityDto: CreatePoaActivityDto): Promise<PoaActivity> {
    const activity = this.poaActivityRepository.create(createPoaActivityDto);
    return this.poaActivityRepository.save(activity);
  }

  async findByPoaPeriodId(poaPeriodId: string): Promise<PoaActivity[]> {
    return this.poaActivityRepository.find({
      where: { poaPeriodId, isActive: true },
      relations: ['program'],
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<PoaActivity> {
    return this.poaActivityRepository.findOne({
      where: { id },
      relations: ['program', 'poaPeriod'],
    });
  }

  async createBatch(activities: CreatePoaActivityDto[]): Promise<PoaActivity[]> {
    const poaActivities = this.poaActivityRepository.create(activities);
    return this.poaActivityRepository.save(poaActivities);
  }
}
