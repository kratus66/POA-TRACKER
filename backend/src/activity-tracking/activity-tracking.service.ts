import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityTracking, TrackingStatus } from './entities/activity-tracking.entity';
import { Validation } from '../validations/entities/validation.entity';
import {
  CreateActivityTrackingDto,
  UpdateActivityTrackingDto,
  BulkCreateActivityTrackingDto,
} from './dtos/create-activity-tracking.dto';

@Injectable()
export class ActivityTrackingService {
  constructor(
    @InjectRepository(ActivityTracking)
    private readonly trackingRepo: Repository<ActivityTracking>,
    @InjectRepository(Validation)
    private readonly validationRepo: Repository<Validation>,
  ) {}

  async create(
    createTrackingDto: CreateActivityTrackingDto,
  ): Promise<ActivityTracking> {
    const validation = await this.validationRepo.findOne({
      where: { id: createTrackingDto.validationId },
    });

    if (!validation) {
      throw new NotFoundException(
        `Validation ${createTrackingDto.validationId} not found`,
      );
    }

    const tracking = this.trackingRepo.create({
      ...createTrackingDto,
      trackingDate: new Date(createTrackingDto.trackingDate),
    });

    return this.trackingRepo.save(tracking);
  }

  async bulkCreate(
    bulkDto: BulkCreateActivityTrackingDto,
  ): Promise<ActivityTracking[]> {
    const trackings = [];

    for (const trackingDto of bulkDto.trackings) {
      const validation = await this.validationRepo.findOne({
        where: { id: trackingDto.validationId },
      });

      if (!validation) {
        throw new NotFoundException(
          `Validation ${trackingDto.validationId} not found`,
        );
      }

      const tracking = this.trackingRepo.create({
        ...trackingDto,
        trackingDate: new Date(trackingDto.trackingDate),
      });

      trackings.push(tracking);
    }

    return this.trackingRepo.save(trackings);
  }

  async findAll(validationId?: string): Promise<ActivityTracking[]> {
    const query = this.trackingRepo.createQueryBuilder('tracking');

    if (validationId) {
      query.where('tracking.validationId = :validationId', { validationId });
    }

    return query.orderBy('tracking.trackingDate', 'DESC').getMany();
  }

  async findById(id: string): Promise<ActivityTracking> {
    const tracking = await this.trackingRepo.findOne({
      where: { id },
      relations: ['validation', 'reviewer', 'verifier'],
    });

    if (!tracking) {
      throw new NotFoundException(`Tracking ${id} not found`);
    }

    return tracking;
  }

  async update(
    id: string,
    updateTrackingDto: UpdateActivityTrackingDto,
  ): Promise<ActivityTracking> {
    const tracking = await this.findById(id);

    Object.assign(tracking, updateTrackingDto);

    if (updateTrackingDto.trackingDate) {
      tracking.trackingDate = new Date(updateTrackingDto.trackingDate);
    }

    if (updateTrackingDto.isVerified) {
      tracking.verifiedAt = new Date();
    }

    return this.trackingRepo.save(tracking);
  }

  async getTrackingHistory(validationId: string): Promise<ActivityTracking[]> {
    const validation = await this.validationRepo.findOne({
      where: { id: validationId },
    });

    if (!validation) {
      throw new NotFoundException(`Validation ${validationId} not found`);
    }

    return this.trackingRepo.find({
      where: { validationId },
      relations: ['reviewer', 'verifier'],
      order: { trackingDate: 'DESC' },
    });
  }

  async getTrackingStatistics(validationId: string): Promise<any> {
    const trackings = await this.trackingRepo.find({
      where: { validationId },
    });

    if (trackings.length === 0) {
      return {
        totalRecords: 0,
        averageQuantitativeValue: 0,
        latestStatus: null,
        latestTracking: null,
      };
    }

    const latestTracking = trackings.reduce((prev, current) =>
      prev.trackingDate > current.trackingDate ? prev : current,
    );

    const quantitativeValues = trackings
      .filter((t) => t.quantitativeValue !== null && t.quantitativeValue !== undefined)
      .map((t) => t.quantitativeValue);

    const averageQuantitativeValue =
      quantitativeValues.length > 0
        ? quantitativeValues.reduce((a, b) => a + b, 0) /
          quantitativeValues.length
        : 0;

    return {
      totalRecords: trackings.length,
      averageQuantitativeValue: parseFloat(averageQuantitativeValue.toFixed(2)),
      latestStatus: latestTracking.status,
      latestTracking,
      statusDistribution: {
        [TrackingStatus.CUMPLE]: trackings.filter(
          (t) => t.status === TrackingStatus.CUMPLE,
        ).length,
        [TrackingStatus.NO_CUMPLE]: trackings.filter(
          (t) => t.status === TrackingStatus.NO_CUMPLE,
        ).length,
        [TrackingStatus.NO_APLICA]: trackings.filter(
          (t) => t.status === TrackingStatus.NO_APLICA,
        ).length,
        [TrackingStatus.PENDIENTE]: trackings.filter(
          (t) => t.status === TrackingStatus.PENDIENTE,
        ).length,
      },
    };
  }

  async delete(id: string): Promise<void> {
    const result = await this.trackingRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Tracking ${id} not found`);
    }
  }
}
