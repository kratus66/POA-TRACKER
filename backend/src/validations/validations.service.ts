import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Validation, ValidationStatus } from './entities/validation.entity';
import { BulkUpdateValidationDto } from './dtos/bulk-update-validation.dto';
import { Review, ReviewStatus } from '../reviews/entities/review.entity';

@Injectable()
export class ValidationsService {
  constructor(
    @InjectRepository(Validation)
    private validationRepository: Repository<Validation>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  private async assertReviewOpen(reviewId: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException('Review no encontrada');
    }

    if (review.status === ReviewStatus.CLOSED) {
      throw new BadRequestException('La revisión está cerrada');
    }

    return review;
  }

  async create(reviewId: string, activityId: string): Promise<Validation> {
    await this.assertReviewOpen(reviewId);
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
    const reviewCache = new Map<string, Review>();
    for (const item of bulkUpdateDto.validations) {
      const validation = await this.validationRepository.findOne({
        where: { id: item.id },
      });
      if (validation) {
        const cached = reviewCache.get(validation.reviewId);
        if (cached) {
          if (cached.status === ReviewStatus.CLOSED) {
            throw new BadRequestException('La revisión está cerrada');
          }
        } else {
          const review = await this.assertReviewOpen(validation.reviewId);
          reviewCache.set(validation.reviewId, review);
        }

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
    await this.assertReviewOpen(reviewId);
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
