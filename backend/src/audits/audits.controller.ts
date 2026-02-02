import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditsService } from './audits.service';
import { Audit, AuditEntityType, AuditAction } from './entities/audit.entity';

@Controller('audits')
@UseGuards(JwtAuthGuard)
export class AuditsController {
  constructor(private auditsService: AuditsService) {}

  /**
   * GET /audits/entity/:entityType/:entityId
   * Obtener historial de auditoría de una entidad
   */
  @Get('entity/:entityType/:entityId')
  async getEntityHistory(
    @Param('entityType') entityType: AuditEntityType,
    @Param('entityId') entityId: string,
    @Query('limit') limit?: string,
  ): Promise<Audit[]> {
    return this.auditsService.getHistory(
      entityType,
      entityId,
      limit ? parseInt(limit, 10) : 100,
    );
  }

  /**
   * GET /audits/user/:userId
   * Obtener todas las acciones de un usuario
   */
  @Get('user/:userId')
  async getUserAudits(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ): Promise<Audit[]> {
    return this.auditsService.getByUser(userId, limit ? parseInt(limit, 10) : 100);
  }

  /**
   * GET /audits/action/:action
   * Obtener auditorías por acción (CREATE, UPDATE, DELETE, etc)
   */
  @Get('action/:action')
  async getByAction(
    @Param('action') action: AuditAction,
    @Query('entityType') entityType?: AuditEntityType,
    @Query('limit') limit?: string,
  ): Promise<Audit[]> {
    return this.auditsService.getByAction(
      action,
      entityType,
      limit ? parseInt(limit, 10) : 100,
    );
  }

  /**
   * GET /audits/stats
   * Estadísticas de auditoría
   */
  @Get('stats')
  async getStats(
    @Query('entityType') entityType?: AuditEntityType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return this.auditsService.getStats(entityType, start, end);
  }

  /**
   * GET /audits/activity/:activityId
   * Obtener historial de cambios de una actividad
   */
  @Get('activity/:activityId')
  async getActivityHistory(
    @Param('activityId') activityId: string,
  ): Promise<Audit[]> {
    return this.auditsService.getHistory(
      AuditEntityType.AGREEMENT_ACTIVITY,
      activityId,
      100,
    );
  }

  /**
   * GET /audits/review/:reviewId
   * Obtener historial de cambios de una revisión
   */
  @Get('review/:reviewId')
  async getReviewHistory(
    @Param('reviewId') reviewId: string,
  ): Promise<Audit[]> {
    return this.auditsService.getHistory(
      AuditEntityType.REVIEW,
      reviewId,
      100,
    );
  }
}
