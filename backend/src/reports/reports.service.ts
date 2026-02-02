import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../reviews/entities/review.entity';
import { Validation, ValidationStatus } from '../validations/entities/validation.entity';

interface KPIs {
  cumple: number;
  noCumple: number;
  noAplica: number;
  pendiente: number;
  total: number;
  cumplePercentage: number;
  noCumplePercentage: number;
  noAplicaPercentage: number;
  pendientePercentage: number;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Validation)
    private validationRepository: Repository<Validation>,
  ) {}

  async getReviewSummary(semester?: number, year?: number): Promise<any> {
    let query = this.reviewRepository.createQueryBuilder('review');

    if (semester) {
      query = query.andWhere('review.semester = :semester', { semester });
    }

    if (year) {
      query = query.andWhere('review.year = :year', { year });
    }

    const reviews = await query
      .leftJoinAndSelect('review.validations', 'validations')
      .leftJoinAndSelect('review.agreement', 'agreement')
      .getMany();

    return {
      totalReviews: reviews.length,
      reviews: reviews.map((review) => ({
        id: review.id,
        agreementId: review.agreementId,
        status: review.status,
        semester: review.semester,
        year: review.year,
        validationsCount: review.validations?.length || 0,
      })),
    };
  }

  async getMunicipalitySummary(
    municipalityId: string,
    semester?: number,
    year?: number,
  ): Promise<any> {
    let query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.agreement', 'agreement')
      .leftJoinAndSelect('agreement.municipality', 'municipality')
      .leftJoinAndSelect('review.validations', 'validations')
      .where('municipality.id = :municipalityId', { municipalityId });

    if (semester) {
      query = query.andWhere('review.semester = :semester', { semester });
    }

    if (year) {
      query = query.andWhere('review.year = :year', { year });
    }

    const reviews = await query.getMany();
    const kpis = this.calculateKPIs(reviews);

    return {
      municipalityId,
      totalReviews: reviews.length,
      kpis,
    };
  }

  async getAgreementSummary(
    agreementId: string,
    semester?: number,
    year?: number,
  ): Promise<any> {
    let query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.agreement', 'agreement')
      .leftJoinAndSelect('review.validations', 'validations')
      .leftJoinAndSelect('validations.activity', 'activity')
      .where('agreement.id = :agreementId', { agreementId });

    if (semester) {
      query = query.andWhere('review.semester = :semester', { semester });
    }

    if (year) {
      query = query.andWhere('review.year = :year', { year });
    }

    const reviews = await query.getMany();
    const kpis = this.calculateKPIs(reviews);

    return {
      agreementId,
      reviews: reviews.map((review) => ({
        id: review.id,
        status: review.status,
        semester: review.semester,
        year: review.year,
        validations: review.validations?.map((v) => ({
          id: v.id,
          status: v.status,
          observations: v.observations,
          activityDescription: v.activity?.description,
        })),
      })),
      kpis,
    };
  }

  private calculateKPIs(reviews: Review[]): KPIs {
    let cumple = 0;
    let noCumple = 0;
    let noAplica = 0;
    let pendiente = 0;

    reviews.forEach((review) => {
      review.validations?.forEach((validation) => {
        switch (validation.status) {
          case ValidationStatus.CUMPLE:
            cumple++;
            break;
          case ValidationStatus.NO_CUMPLE:
            noCumple++;
            break;
          case ValidationStatus.NO_APLICA:
            noAplica++;
            break;
          case ValidationStatus.PENDIENTE:
            pendiente++;
            break;
        }
      });
    });

    const total = cumple + noCumple + noAplica + pendiente;
    const cumplePercentage = total > 0 ? (cumple / total) * 100 : 0;
    const noCumplePercentage = total > 0 ? (noCumple / total) * 100 : 0;
    const noAplicaPercentage = total > 0 ? (noAplica / total) * 100 : 0;
    const pendientePercentage = total > 0 ? (pendiente / total) * 100 : 0;

    return {
      cumple,
      noCumple,
      noAplica,
      pendiente,
      total,
      cumplePercentage,
      noCumplePercentage,
      noAplicaPercentage,
      pendientePercentage,
    };
  }
}
