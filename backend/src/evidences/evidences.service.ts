import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidence } from './entities/evidence.entity';
import { CreateEvidenceDto, UpdateEvidenceDto, BulkUploadEvidencesDto } from './dtos/create-evidence.dto';
import { Review, ReviewStatus } from '../reviews/entities/review.entity';
import { AgreementActivity } from '../agreement-activities/entities/agreement-activity.entity';

@Injectable()
export class EvidencesService {
  constructor(
    @InjectRepository(Evidence)
    private evidencesRepository: Repository<Evidence>,
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(AgreementActivity)
    private activitiesRepository: Repository<AgreementActivity>,
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

  async create(createEvidenceDto: CreateEvidenceDto, userId: string): Promise<Evidence> {
    await this.assertReviewOpen(createEvidenceDto.reviewId);

    // Validar que existe la actividad
    const activity = await this.activitiesRepository.findOne({
      where: { id: createEvidenceDto.activityId },
    });
    if (!activity) {
      throw new NotFoundException('Actividad no encontrada');
    }

    // Crear evidencia
    const evidence = this.evidencesRepository.create({
      ...createEvidenceDto,
      uploadedByUserId: userId,
    });

    return this.evidencesRepository.save(evidence);
  }

  async bulkUpload(bulkUploadDto: BulkUploadEvidencesDto, userId: string): Promise<Evidence[]> {
    const createdEvidences: Evidence[] = [];

    for (const evidenceDto of bulkUploadDto.evidences) {
      const evidence = await this.create(evidenceDto, userId);
      createdEvidences.push(evidence);
    }

    return createdEvidences;
  }

  async findAll(filters?: {
    reviewId?: string;
    activityId?: string;
    documentType?: string;
  }): Promise<Evidence[]> {
    const query = this.evidencesRepository
      .createQueryBuilder('evidence')
      .leftJoinAndSelect('evidence.review', 'review')
      .leftJoinAndSelect('evidence.activity', 'activity')
      .leftJoinAndSelect('evidence.uploadedBy', 'uploadedBy')
      .where('evidence.isActive = :isActive', { isActive: true });

    if (filters?.reviewId) {
      query.andWhere('evidence.reviewId = :reviewId', { reviewId: filters.reviewId });
    }

    if (filters?.activityId) {
      query.andWhere('evidence.activityId = :activityId', { activityId: filters.activityId });
    }

    if (filters?.documentType) {
      query.andWhere('evidence.documentType = :documentType', {
        documentType: filters.documentType,
      });
    }

    return query.orderBy('evidence.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Evidence> {
    const evidence = await this.evidencesRepository.findOne({
      where: { id, isActive: true },
      relations: ['review', 'activity', 'uploadedBy'],
    });

    if (!evidence) {
      throw new NotFoundException('Evidencia no encontrada');
    }

    return evidence;
  }

  async findByActivity(activityId: string, reviewId?: string): Promise<Evidence[]> {
    const query = this.evidencesRepository.find({
      where: {
        activityId,
        isActive: true,
        ...(reviewId && { reviewId }),
      },
      relations: ['review', 'activity', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });

    return query;
  }

  async findByReview(reviewId: string): Promise<Evidence[]> {
    return this.evidencesRepository.find({
      where: { reviewId, isActive: true },
      relations: ['review', 'activity', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateEvidenceDto: UpdateEvidenceDto): Promise<Evidence> {
    const evidence = await this.findById(id);

    await this.assertReviewOpen(evidence.reviewId);

    Object.assign(evidence, updateEvidenceDto);

    return this.evidencesRepository.save(evidence);
  }

  async softDelete(id: string): Promise<void> {
    const evidence = await this.findById(id);

    await this.assertReviewOpen(evidence.reviewId);

    evidence.isActive = false;
    evidence.deletedAt = new Date();

    await this.evidencesRepository.save(evidence);
  }

  async hardDelete(id: string): Promise<void> {
    const evidence = await this.findById(id);
    await this.assertReviewOpen(evidence.reviewId);
    await this.evidencesRepository.remove(evidence);
  }

  async getEvidencesByReviewAndActivity(
    reviewId: string,
    activityId: string,
  ): Promise<Evidence[]> {
    return this.evidencesRepository.find({
      where: {
        reviewId,
        activityId,
        isActive: true,
      },
      relations: ['uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getEvidenceStats(reviewId: string): Promise<{
    totalEvidences: number;
    byDocumentType: Record<string, number>;
    activitiesWithEvidences: string[];
  }> {
    const evidences = await this.findByReview(reviewId);

    const byDocumentType: Record<string, number> = {};
    const activitiesSet = new Set<string>();

    for (const evidence of evidences) {
      byDocumentType[evidence.documentType] = (byDocumentType[evidence.documentType] || 0) + 1;
      activitiesSet.add(evidence.activityId);
    }

    return {
      totalEvidences: evidences.length,
      byDocumentType,
      activitiesWithEvidences: Array.from(activitiesSet),
    };
  }
}
