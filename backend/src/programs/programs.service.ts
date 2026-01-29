import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto, UpdateProgramDto, ProgramFilterDto } from './dtos/program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto) {
    const existingProgram = await this.programRepository.findOne({
      where: { name: createProgramDto.name },
    });

    if (existingProgram) {
      throw new BadRequestException(`Programa "${createProgramDto.name}" ya existe`);
    }

    const program = this.programRepository.create(createProgramDto);
    return this.programRepository.save(program);
  }

  async findAll(filterDto: ProgramFilterDto) {
    const { search, page = 1, limit = 10 } = filterDto;
    const query = this.programRepository.createQueryBuilder('p');

    if (search) {
      query.where('p.name ILIKE :search OR p.description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    query.andWhere('p.active = :active', { active: true });

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit).orderBy('p.name', 'ASC');

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
    const program = await this.programRepository.findOne({
      where: { id },
    });

    if (!program) {
      throw new BadRequestException(`Programa con ID ${id} no encontrado`);
    }

    return program;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto) {
    await this.findById(id);

    if (updateProgramDto.name) {
      const existingProgram = await this.programRepository.findOne({
        where: { name: updateProgramDto.name },
      });

      if (existingProgram && existingProgram.id !== id) {
        throw new BadRequestException(`Programa "${updateProgramDto.name}" ya existe`);
      }
    }

    await this.programRepository.update(id, updateProgramDto);

    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);

    await this.programRepository.update(id, { active: false });

    return { message: 'Programa desactivado exitosamente' };
  }

  async getActivePrograms() {
    return this.programRepository.find({
      where: { active: true },
      order: { name: 'ASC' },
    });
  }
}
