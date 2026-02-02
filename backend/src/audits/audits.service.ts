import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, LessThan } from 'typeorm';
import { Audit, AuditAction, AuditEntityType } from './entities/audit.entity';

interface AuditLogInput {
  entityType: AuditEntityType;
  entityId: string;
  action: AuditAction;
  userId?: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  reason?: string;
  metadata?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
}

@Injectable()
export class AuditsService {
  constructor(
    @InjectRepository(Audit)
    private auditsRepository: Repository<Audit>,
  ) {}

  /**
   * Registrar una acción de auditoría
   */
  async log(input: AuditLogInput): Promise<Audit> {
    const changes = this.calculateChanges(input.oldData, input.newData);

    const audit = this.auditsRepository.create({
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      userId: input.userId,
      oldData: input.oldData,
      newData: input.newData,
      changes,
      reason: input.reason,
      metadata: input.metadata,
      success: input.success !== false,
      errorMessage: input.errorMessage,
    });

    return this.auditsRepository.save(audit);
  }

  /**
   * Obtener historial de auditoría de una entidad
   */
  async getHistory(
    entityType: AuditEntityType,
    entityId: string,
    limit: number = 100,
  ): Promise<Audit[]> {
    return this.auditsRepository.find({
      where: { entityType, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Obtener auditorías por usuario
   */
  async getByUser(userId: string, limit: number = 100): Promise<Audit[]> {
    return this.auditsRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Obtener auditorías por acción
   */
  async getByAction(
    action: AuditAction,
    entityType?: AuditEntityType,
    limit: number = 100,
  ): Promise<Audit[]> {
    const query = this.auditsRepository.createQueryBuilder('audit')
      .where('audit.action = :action', { action })
      .leftJoinAndSelect('audit.user', 'user');

    if (entityType) {
      query.andWhere('audit.entityType = :entityType', { entityType });
    }

    return query
      .orderBy('audit.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Obtener cambios de una entidad en un período de tiempo
   */
  async getChangesBetween(
    entityType: AuditEntityType,
    entityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Audit[]> {
    return this.auditsRepository
      .createQueryBuilder('audit')
      .where('audit.entityType = :entityType', { entityType })
      .andWhere('audit.entityId = :entityId', { entityId })
      .andWhere('audit.createdAt >= :startDate', { startDate })
      .andWhere('audit.createdAt <= :endDate', { endDate })
      .leftJoinAndSelect('audit.user', 'user')
      .orderBy('audit.createdAt', 'ASC')
      .getMany();
  }

  /**
   * Estadísticas de auditoría
   */
  async getStats(
    entityType?: AuditEntityType,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const query = this.auditsRepository.createQueryBuilder('audit');

    if (entityType) {
      query.where('audit.entityType = :entityType', { entityType });
    }

    if (startDate && endDate) {
      query.andWhere('audit.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const [
      totalActions,
      createCount,
      updateCount,
      deleteCount,
      successCount,
      failureCount,
    ] = await Promise.all([
      query.clone().getCount(),
      query.clone().where('audit.action = :action', { action: AuditAction.CREATE }).getCount(),
      query.clone().where('audit.action = :action', { action: AuditAction.UPDATE }).getCount(),
      query.clone().where('audit.action = :action', { action: AuditAction.DELETE }).getCount(),
      query.clone().where('audit.success = :success', { success: true }).getCount(),
      query.clone().where('audit.success = :success', { success: false }).getCount(),
    ]);

    return {
      totalActions,
      byAction: {
        create: createCount,
        update: updateCount,
        delete: deleteCount,
      },
      status: {
        success: successCount,
        failure: failureCount,
      },
      successRate: ((successCount / (successCount + failureCount)) * 100).toFixed(2) + '%',
    };
  }

  /**
   * Calcular qué campos cambiaron
   */
  private calculateChanges(oldData?: Record<string, any>, newData?: Record<string, any>) {
    if (!oldData || !newData) return null;

    const changes: Record<string, { old: any; new: any }> = {};

    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);

    for (const key of allKeys) {
      if (oldData[key] !== newData[key]) {
        changes[key] = {
          old: oldData[key],
          new: newData[key],
        };
      }
    }

    return Object.keys(changes).length > 0 ? changes : null;
  }

  /**
   * Limpiar auditorías antiguas (más de N días)
   */
  async deleteOldAudits(daysToKeep: number = 365): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    await this.auditsRepository.delete({
      createdAt: LessThan(cutoffDate),
    });
  }
}
