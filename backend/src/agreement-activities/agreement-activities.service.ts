import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgreementActivity } from './entities/agreement-activity.entity';
import {
  CreateAgreementActivityDto,
  UpdateAgreementActivityDto,
  AgreementActivityFilterDto,
} from './dtos/agreement-activity.dto';
import { Review, ReviewStatus } from '../reviews/entities/review.entity';
import { AuditsService } from '../audits/audits.service';
import { AuditEntityType, AuditAction } from '../audits/entities/audit.entity';

@Injectable()
export class AgreementActivitiesService {
  constructor(
    @InjectRepository(AgreementActivity)
    private activityRepository: Repository<AgreementActivity>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private auditsService: AuditsService,
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

  /**
   * Verificar si una actividad puede ser editada
   * Solo editable si la revisión está en DRAFT o REOPENED
   */
  async canEditActivity(activityId: string): Promise<{ canEdit: boolean; review?: Review }> {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['poaPeriod'],
    });

    if (!activity) {
      throw new NotFoundException('Actividad no encontrada');
    }

    // Buscar la revisión activa para este período
    const review = await this.reviewsRepository.findOne({
      where: { poaPeriodId: activity.poaPeriodId },
      order: { createdAt: 'DESC' },
    });

    if (!review) {
      // Si no hay revisión, la actividad puede editarse
      return { canEdit: true };
    }

    const canEdit =
      review.status === ReviewStatus.DRAFT || review.status === ReviewStatus.REOPENED;

    return { canEdit, review };
  }

  /**
   * Actualizar actividad con validación y auditoría
   */
  async updateWithAudit(
    id: string,
    updateActivityDto: UpdateAgreementActivityDto,
    userId: string,
  ): Promise<AgreementActivity> {
    const activity = await this.findById(id);
    const oldData = { ...activity };

    // Verificar si puede editarse
    const { canEdit, review } = await this.canEditActivity(id);

    if (!canEdit && review) {
      throw new ForbiddenException(
        `No se puede editar. La revisión está en estado ${review.status}. Debe reabrirse la revisión.`,
      );
    }

    // Actualizar actividad
    Object.assign(activity, updateActivityDto);
    const updated = await this.activityRepository.save(activity);

    // Registrar en auditoría
    await this.auditsService.log({
      entityType: AuditEntityType.AGREEMENT_ACTIVITY,
      entityId: id,
      action: AuditAction.UPDATE,
      userId,
      oldData: oldData,
      newData: updated,
    });

    return updated;
  }
}
