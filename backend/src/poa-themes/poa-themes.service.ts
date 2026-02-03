import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoaTheme } from './entities/poa-theme.entity';
import { CreatePoaThemeDto } from './dtos/create-poa-theme.dto';
import { UpdatePoaThemeDto } from './dtos/update-poa-theme.dto';

@Injectable()
export class PoaThemesService {
  constructor(
    @InjectRepository(PoaTheme)
    private poaThemeRepository: Repository<PoaTheme>,
  ) {}

  async create(createPoaThemeDto: CreatePoaThemeDto): Promise<PoaTheme> {
    // Validar que no exista un tema con el mismo título
    const existingByTitle = await this.poaThemeRepository.findOne({
      where: { title: createPoaThemeDto.title },
    });

    if (existingByTitle) {
      throw new BadRequestException(
        `Ya existe un tema con el título "${createPoaThemeDto.title}"`,
      );
    }

    // Validar que no exista un tema con la misma sheetKey
    const existingByKey = await this.poaThemeRepository.findOne({
      where: { sheetKey: createPoaThemeDto.sheetKey },
    });

    if (existingByKey) {
      throw new BadRequestException(
        `Ya existe un tema con la clave de hoja "${createPoaThemeDto.sheetKey}"`,
      );
    }

    const theme = this.poaThemeRepository.create({
      ...createPoaThemeDto,
      active: createPoaThemeDto.active ?? true,
    });

    return this.poaThemeRepository.save(theme);
  }

  async findAll(active?: boolean): Promise<PoaTheme[]> {
    const query = this.poaThemeRepository.createQueryBuilder('theme');

    if (active !== undefined) {
      query.andWhere('theme.active = :active', { active });
    }

    return query.orderBy('theme.title', 'ASC').getMany();
  }

  async findById(id: string): Promise<PoaTheme> {
    const theme = await this.poaThemeRepository.findOne({
      where: { id },
      relations: [
        'poaTemplateActivities',
        'agreementActivities',
        'poaActivities',
        'validations',
      ],
    });

    if (!theme) {
      throw new NotFoundException(`Tema con ID "${id}" no encontrado`);
    }

    return theme;
  }

  async findByTitle(title: string): Promise<PoaTheme> {
    const theme = await this.poaThemeRepository.findOne({
      where: { title },
    });

    if (!theme) {
      throw new NotFoundException(`Tema con título "${title}" no encontrado`);
    }

    return theme;
  }

  async findBySheetKey(sheetKey: string): Promise<PoaTheme> {
    const theme = await this.poaThemeRepository.findOne({
      where: { sheetKey },
    });

    if (!theme) {
      throw new NotFoundException(
        `Tema con clave de hoja "${sheetKey}" no encontrado`,
      );
    }

    return theme;
  }

  async update(id: string, updatePoaThemeDto: UpdatePoaThemeDto): Promise<PoaTheme> {
    const theme = await this.findById(id);

    // Validar unicidad si se actualiza el título
    if (updatePoaThemeDto.title && updatePoaThemeDto.title !== theme.title) {
      const existingByTitle = await this.poaThemeRepository.findOne({
        where: { title: updatePoaThemeDto.title },
      });

      if (existingByTitle) {
        throw new BadRequestException(
          `Ya existe un tema con el título "${updatePoaThemeDto.title}"`,
        );
      }
    }

    Object.assign(theme, updatePoaThemeDto);
    return this.poaThemeRepository.save(theme);
  }

  async remove(id: string): Promise<void> {
    const theme = await this.findById(id);

    // Validar que no haya actividades asociadas
    if (
      theme.poaTemplateActivities?.length > 0 ||
      theme.agreementActivities?.length > 0 ||
      theme.poaActivities?.length > 0 ||
      theme.validations?.length > 0
    ) {
      throw new BadRequestException(
        'No se puede eliminar un tema que tiene actividades o validaciones asociadas',
      );
    }

    await this.poaThemeRepository.remove(theme);
  }

  async getThemeStats(): Promise<any> {
    const themes = await this.poaThemeRepository.find({
      relations: [
        'poaTemplateActivities',
        'agreementActivities',
        'poaActivities',
        'validations',
      ],
    });

    return themes.map((theme) => ({
      id: theme.id,
      title: theme.title,
      sheetKey: theme.sheetKey,
      poaTemplateActivitiesCount: theme.poaTemplateActivities?.length || 0,
      agreementActivitiesCount: theme.agreementActivities?.length || 0,
      poaActivitiesCount: theme.poaActivities?.length || 0,
      validationsCount: theme.validations?.length || 0,
      totalActivities:
        (theme.poaTemplateActivities?.length || 0) +
        (theme.agreementActivities?.length || 0) +
        (theme.poaActivities?.length || 0),
    }));
  }
}
