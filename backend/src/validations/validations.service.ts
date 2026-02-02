import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Validation, ValidationStatus } from './entities/validation.entity';
import { BulkUpdateValidationDto } from './dtos/bulk-update-validation.dto';

@Injectable()
export class ValidationsService {
  constructor(
    @InjectRepository(Validation)
    private validationRepository: Repository<Validation>,
  ) {}

  async create(reviewId: string, activityId: string): Promise<Validation> {
    const validation = this.validationRepository.create({
      reviewId,
      activityId,
      status: ValidationStatus.PENDIENTE,
    });
    return this.validationRepository.save(validation);
  }

  async findByReviewId(reviewId: string): Promise<Validation[]> {
    return this.validationRepository.find({
      where: { reviewId },
      relations: ['activity'],
    });
  }

  async bulkUpdate(bulkUpdateDto: BulkUpdateValidationDto): Promise<Validation[]> {
    const validations = [];
    for (const item of bulkUpdateDto.validations) {
      const validation = await this.validationRepository.findOne({
        where: { id: item.id },
      });
      if (validation) {
        validation.status = item.status;
        validation.observations = item.observations;
        validation.evidence = item.evidence;
        validations.push(await this.validationRepository.save(validation));
      }
    }
    return validations;
  }

  async createForReview(
    reviewId: string,
    activityIds: string[],
  ): Promise<Validation[]> {
    const validations = activityIds.map((activityId) =>
      this.validationRepository.create({
        reviewId,
        activityId,
        status: ValidationStatus.PENDIENTE,
      }),
    );
    return this.validationRepository.save(validations);
  }
}
