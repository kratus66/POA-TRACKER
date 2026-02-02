import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agreement } from './entities/agreement.entity';
import {
  CreateAgreementDto,
  UpdateAgreementDto,
  AgreementFilterDto,
} from './dtos/agreement.dto';
import { MunicipalitiesService } from '../municipalities/municipalities.service';
import { PoaPeriodsService } from 'src/poa-periods/poa-periods.service';
import { PoaTemplatesService } from '../poa-templates/poa-templates.service';
import { AgreementActivitiesService } from '../agreement-activities/agreement-activities.service';

@Injectable()
export class AgreementsService {
  constructor(
    @InjectRepository(Agreement)
    private agreementRepository: Repository<Agreement>,
    private municipalitiesService: MunicipalitiesService,
    private poaPeriodsService: PoaPeriodsService,
    private poaTemplatesService: PoaTemplatesService,
    private agreementActivitiesService: AgreementActivitiesService,
  ) {}

  async create(createAgreementDto: CreateAgreementDto) {
    // Validar que el municipio existe
    await this.municipalitiesService.findById(
      createAgreementDto.municipalityId,
    );

    // Validar que el convenio no existe
    const existingAgreement = await this.agreementRepository.findOne({
      where: { agreementNumber: createAgreementDto.agreementNumber },
    });

    if (existingAgreement) {
      throw new BadRequestException(
        `Convenio con número ${createAgreementDto.agreementNumber} ya existe`,
      );
    }

    // Validar fechas
    const startDate = new Date(createAgreementDto.startDate);
    const endDate = new Date(createAgreementDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de vencimiento',
      );
    }

    const agreement = this.agreementRepository.create(createAgreementDto);
    return this.agreementRepository.save(agreement);
  }

  async findAll(filterDto: AgreementFilterDto) {
    const { municipalityId, departmentId, status, page = 1, limit = 10 } =
      filterDto;

    const query = this.agreementRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.municipality', 'm')
      .leftJoinAndSelect('m.department', 'd');

    if (municipalityId) {
      query.where('a.municipalityId = :municipalityId', { municipalityId });
    }

    if (departmentId) {
      query.andWhere('m.departmentId = :departmentId', { departmentId });
    }

    if (status) {
      query.andWhere('a.status = :status', { status });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit).orderBy('a.agreementNumber', 'DESC');

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
    const agreement = await this.agreementRepository.findOne({
      where: { id },
      relations: ['municipality', 'municipality.department', 'poaPeriods'],
    });

    if (!agreement) {
      throw new BadRequestException(`Convenio con ID ${id} no encontrado`);
    }

    return agreement;
  }

  async update(id: string, updateAgreementDto: UpdateAgreementDto) {
    const agreement = await this.findById(id);

    if (
      updateAgreementDto.startDate &&
      updateAgreementDto.endDate
    ) {
      const startDate = new Date(updateAgreementDto.startDate);
      const endDate = new Date(updateAgreementDto.endDate);

      if (startDate >= endDate) {
        throw new BadRequestException(
          'La fecha de inicio debe ser anterior a la fecha de vencimiento',
        );
      }
    }

    await this.agreementRepository.update(id, updateAgreementDto);

    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);

    await this.agreementRepository.delete(id);

    return { message: 'Convenio eliminado exitosamente' };
  }

  async getByMunicipality(municipalityId: string) {
    return this.agreementRepository.find({
      where: { municipalityId },
      relations: ['poaPeriods'],
      order: { agreementNumber: 'DESC' },
    });
  }

  async applyTemplate(
    agreementId: string,
    templateId: string,
    year?: number,
  ) {
    await this.findById(agreementId);

    const template = await this.poaTemplatesService.findById(templateId);

    if (!template.activities || template.activities.length === 0) {
      throw new BadRequestException('La plantilla no tiene actividades');
    }

    let poaPeriod = null;

    if (year) {
      poaPeriod = await this.poaPeriodsService.getByAgreementAndYear(
        agreementId,
        year,
      );
    } else {
      poaPeriod = await this.poaPeriodsService.getLatestByAgreement(agreementId);
    }

    if (!poaPeriod) {
      const currentYear = new Date().getFullYear();
      poaPeriod = await this.poaPeriodsService.create({
        agreementId,
        year: year || currentYear,
        notes: `POA para el año ${year || currentYear}`,
      });
    }

    const existingActivities =
      await this.agreementActivitiesService.getActivitiesByPoaPeriod(
        poaPeriod.id,
      );

    if (existingActivities.length > 0) {
      throw new BadRequestException(
        'Ya existen actividades para este POA. Elimine o cree un nuevo POA.',
      );
    }

    const createdActivities =
      await this.agreementActivitiesService.createFromTemplate(
        poaPeriod.id,
        template.activities,
      );

    return {
      poaPeriod,
      activities: createdActivities,
      templateId: template.id,
    };
  }
}
