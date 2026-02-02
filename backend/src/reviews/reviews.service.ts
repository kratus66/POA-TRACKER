import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './entities/review.entity';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewStatusDto } from './dtos/update-review-status.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      status: ReviewStatus.DRAFT,
    });
    return this.reviewRepository.save(review);
  }

  async findById(id: string): Promise<Review> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['agreement', 'poaPeriod', 'validations', 'validations.activity'],
    });
  }

  async findByAgreementAndPeriod(
    agreementId: string,
    poaPeriodId: string,
  ): Promise<Review> {
    return this.reviewRepository.findOne({
      where: { agreementId, poaPeriodId },
      relations: ['agreement', 'poaPeriod', 'validations', 'validations.activity'],
    });
  }

  async updateStatus(
    id: string,
    updateDto: UpdateReviewStatusDto,
  ): Promise<Review> {
    const review = await this.findById(id);
    review.status = updateDto.status;
    if (updateDto.status === ReviewStatus.CLOSED) {
      review.closedAt = new Date();
    }
    return this.reviewRepository.save(review);
  }

  async findAll(filters?: any): Promise<Review[]> {
    const query = this.reviewRepository.createQueryBuilder('review');

    if (filters?.agreementId) {
      query.andWhere('review.agreementId = :agreementId', {
        agreementId: filters.agreementId,
      });
    }

    if (filters?.status) {
      query.andWhere('review.status = :status', { status: filters.status });
    }

    return query.leftJoinAndSelect('review.validations', 'validations').getMany();
  }
}
