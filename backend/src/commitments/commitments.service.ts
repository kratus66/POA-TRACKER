import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Commitment,
  CommitmentStatus,
} from './entities/commitment.entity';
import { CreateCommitmentDto } from './dtos/create-commitment.dto';
import { CloseCommitmentDto } from './dtos/close-commitment.dto';
import { Review, ReviewStatus } from '../reviews/entities/review.entity';
import { AgreementActivity } from '../agreement-activities/entities/agreement-activity.entity';

const ALLOWED_COMMITMENT_ACTIVITY_STATUSES = new Set([
  'PENDING',
  'PENDIENTE',
  'NO_CUMPLIDA',
  'NO_CUMPLE',
]);

@Injectable()
export class CommitmentsService {
  constructor(
    @InjectRepository(Commitment)
    private commitmentsRepository: Repository<Commitment>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(AgreementActivity)
    private activitiesRepository: Repository<AgreementActivity>,
  ) {}

  private async assertReviewOpen(reviewCycleId: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewCycleId },
    });

    if (!review) {
      throw new NotFoundException('Revisión no encontrada');
    }

    if (review.status === ReviewStatus.CLOSED) {
      throw new BadRequestException('La revisión está cerrada');
    }

    return review;
  }

  private async getActivityOrFail(agreementActivityId: string) {
    const activity = await this.activitiesRepository.findOne({
      where: { id: agreementActivityId },
    });

    if (!activity) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return activity;
  }

  async create(createDto: CreateCommitmentDto, userId?: string): Promise<Commitment> {
    await this.assertReviewOpen(createDto.reviewCycleId);

    const activity = await this.getActivityOrFail(createDto.agreementActivityId);

    if (!ALLOWED_COMMITMENT_ACTIVITY_STATUSES.has(activity.status)) {
      throw new BadRequestException(
        'Solo se puede crear compromiso si la actividad está NO_CUMPLIDA o PENDIENTE',
      );
    }

    const commitment = this.commitmentsRepository.create({
      description: createDto.description,
      dueDate: new Date(createDto.dueDate),
      responsibleRole: createDto.responsibleRole,
      reviewCycleId: createDto.reviewCycleId,
      agreementActivityId: createDto.agreementActivityId,
      status: CommitmentStatus.OPEN,
      createdByUserId: userId,
    });

    return this.commitmentsRepository.save(commitment);
  }

  async findAll(filters?: {
    reviewCycleId?: string;
    agreementActivityId?: string;
    status?: CommitmentStatus;
  }): Promise<Commitment[]> {
    const query = this.commitmentsRepository
      .createQueryBuilder('commitment')
      .leftJoinAndSelect('commitment.review', 'review')
      .leftJoinAndSelect('commitment.agreementActivity', 'activity')
      .leftJoinAndSelect('commitment.createdBy', 'createdBy');

    if (filters?.reviewCycleId) {
      query.andWhere('commitment.reviewCycleId = :reviewCycleId', {
        reviewCycleId: filters.reviewCycleId,
      });
    }

    if (filters?.agreementActivityId) {
      query.andWhere('commitment.agreementActivityId = :agreementActivityId', {
        agreementActivityId: filters.agreementActivityId,
      });
    }

    if (filters?.status) {
      query.andWhere('commitment.status = :status', { status: filters.status });
    }

    return query.orderBy('commitment.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Commitment> {
    const commitment = await this.commitmentsRepository.findOne({
      where: { id },
      relations: ['review', 'agreementActivity', 'createdBy'],
    });

    if (!commitment) {
      throw new NotFoundException('Compromiso no encontrado');
    }

    return commitment;
  }

  async findOpen(reviewCycleId?: string): Promise<Commitment[]> {
    return this.findAll({
      reviewCycleId,
      status: CommitmentStatus.OPEN,
    });
  }

  async close(id: string, closeDto: CloseCommitmentDto): Promise<Commitment> {
    const commitment = await this.commitmentsRepository.findOne({
      where: { id },
    });

    if (!commitment) {
      throw new NotFoundException('Compromiso no encontrado');
    }

    await this.assertReviewOpen(commitment.reviewCycleId);

    commitment.status = CommitmentStatus.CLOSED;
    commitment.closedAt = new Date();
    commitment.closureNotes = closeDto.closureNotes;

    return this.commitmentsRepository.save(commitment);
  }

  async getPreviousCycleCommitments(
    agreementActivityId: string,
    currentReviewCycleId?: string,
  ): Promise<Commitment[]> {
    const query = this.commitmentsRepository
      .createQueryBuilder('commitment')
      .where('commitment.agreementActivityId = :agreementActivityId', {
        agreementActivityId,
      });

    if (currentReviewCycleId) {
      query.andWhere('commitment.reviewCycleId != :currentReviewCycleId', {
        currentReviewCycleId,
      });
    }

    return query.orderBy('commitment.createdAt', 'DESC').getMany();
  }
}
