import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoaTemplate } from './entities/poa-template.entity';
import { PoaTemplateActivity } from './entities/poa-template-activity.entity';
import {
  CreatePoaTemplateDto,
  UpdatePoaTemplateDto,
  CreatePoaTemplateActivityDto,
  PoaTemplateFilterDto,
} from './dtos/poa-template.dto';
import { ProgramsService } from '../programs/programs.service';

@Injectable()
export class PoaTemplatesService {
  constructor(
    @InjectRepository(PoaTemplate)
    private poaTemplateRepository: Repository<PoaTemplate>,
    @InjectRepository(PoaTemplateActivity)
    private poaTemplateActivityRepository: Repository<PoaTemplateActivity>,
    private programsService: ProgramsService,
  ) {}

  async create(createPoaTemplateDto: CreatePoaTemplateDto) {
    const template = this.poaTemplateRepository.create(createPoaTemplateDto);
    return this.poaTemplateRepository.save(template);
  }

  async findAll(filterDto: PoaTemplateFilterDto) {
    const { search, page = 1, limit = 10 } = filterDto;
    const query = this.poaTemplateRepository.createQueryBuilder('t');

    if (search) {
      query.where('t.name ILIKE :search', { search: `%${search}%` });
    }

    query.andWhere('t.active = :active', { active: true });

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit).orderBy('t.name', 'ASC');

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
    const template = await this.poaTemplateRepository.findOne({
      where: { id },
      relations: ['activities', 'activities.program'],
    });

    if (!template) {
      throw new BadRequestException(`Plantilla POA con ID ${id} no encontrada`);
    }

    return template;
  }

  async update(id: string, updatePoaTemplateDto: UpdatePoaTemplateDto) {
    await this.findById(id);

    await this.poaTemplateRepository.update(id, updatePoaTemplateDto);

    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);

    await this.poaTemplateRepository.update(id, { active: false });

    return { message: 'Plantilla POA desactivada exitosamente' };
  }

  async addActivity(
    templateId: string,
    createActivityDto: CreatePoaTemplateActivityDto,
  ) {
    // Validar que la plantilla existe
    await this.findById(templateId);

    // Validar que el programa existe
    await this.programsService.findById(createActivityDto.programId);

    const activity = this.poaTemplateActivityRepository.create({
      ...createActivityDto,
      poaTemplateId: templateId,
    });

    return this.poaTemplateActivityRepository.save(activity);
  }

  async getActivitiesByTemplate(templateId: string) {
    await this.findById(templateId);

    return this.poaTemplateActivityRepository.find({
      where: { poaTemplateId: templateId },
      relations: ['program'],
      order: { createdAt: 'DESC' },
    });
  }

  async removeActivity(templateId: string, activityId: string) {
    const activity = await this.poaTemplateActivityRepository.findOne({
      where: { id: activityId, poaTemplateId: templateId },
    });

    if (!activity) {
      throw new BadRequestException(`Actividad de plantilla no encontrada`);
    }

    await this.poaTemplateActivityRepository.delete(activityId);

    return { message: 'Actividad eliminada de plantilla' };
  }

  async getActiveTemplates() {
    return this.poaTemplateRepository.find({
      where: { active: true },
      relations: ['activities'],
      order: { name: 'ASC' },
    });
  }
}
