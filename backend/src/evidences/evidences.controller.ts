import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { EvidencesService } from './evidences.service';
import { CreateEvidenceDto, UpdateEvidenceDto, BulkUploadEvidencesDto } from './dtos/create-evidence.dto';
import { Evidence, DocumentType } from './entities/evidence.entity';

@Controller('evidences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvidencesController {
  constructor(private evidencesService: EvidencesService) {}

  /**
   * POST /evidences
   * Crear una evidencia (sin archivo físico, solo referencia)
   */
  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async create(
    @Body() createEvidenceDto: CreateEvidenceDto,
    @CurrentUser() user: any,
  ): Promise<Evidence> {
    return this.evidencesService.create(createEvidenceDto, user.id);
  }

  /**
   * POST /evidences/bulk
   * Crear múltiples evidencias
   */
  @Post('bulk')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async bulkUpload(
    @Body() bulkUploadDto: BulkUploadEvidencesDto,
    @CurrentUser() user: any,
  ): Promise<Evidence[]> {
    return this.evidencesService.bulkUpload(bulkUploadDto, user.id);
  }

  /**
   * POST /evidences/upload
   * Upload de archivo con Multer (almacenamiento local)
   * Integración con S3 disponible en producción
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/evidences',
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    }),
  )
  @Roles(UserRole.USER, UserRole.ADMIN)
  async uploadFile(
    @UploadedFile() file: any,
    @Body() body: { reviewId: string; activityId: string; description?: string },
    @CurrentUser() user: any,
  ): Promise<Evidence> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validar tamaño
    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException('Archivo muy grande (máximo 50 MB)');
    }

    // En desarrollo: guardar en ./uploads
    // En producción: subir a S3 y obtener URL firmada
    const fileUrl = `/uploads/evidences/${file.filename}`;
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    const createEvidenceDto: CreateEvidenceDto = {
      reviewId: body.reviewId,
      activityId: body.activityId,
      fileUrl,
      fileName: file.originalname,
      fileSize,
      mimeType: file.mimetype,
      documentType: this.inferDocumentType(file.mimetype),
      description: body.description,
      metadata: {
        originalName: file.originalname,
        encoding: file.encoding,
        fieldname: file.fieldname,
      },
    };

    return this.evidencesService.create(createEvidenceDto, user.id);
  }

  /**
   * GET /evidences
   * Listar evidencias con filtros
   */
  @Get()
  async findAll(
    @Query('reviewId') reviewId?: string,
    @Query('activityId') activityId?: string,
    @Query('documentType') documentType?: string,
  ): Promise<Evidence[]> {
    return this.evidencesService.findAll({
      reviewId,
      activityId,
      documentType,
    });
  }

  /**
   * GET /evidences/by-review/:reviewId
   * Obtener todas las evidencias de una revisión
   */
  @Get('by-review/:reviewId')
  async findByReview(@Param('reviewId') reviewId: string): Promise<Evidence[]> {
    return this.evidencesService.findByReview(reviewId);
  }

  /**
   * GET /evidences/by-activity/:activityId
   * Obtener evidencias de una actividad (en todas las revisiones)
   */
  @Get('by-activity/:activityId')
  async findByActivity(@Param('activityId') activityId: string): Promise<Evidence[]> {
    return this.evidencesService.findByActivity(activityId);
  }

  /**
   * GET /evidences/review-activity/:reviewId/:activityId
   * Obtener evidencias específicas de una actividad en una revisión
   */
  @Get('review-activity/:reviewId/:activityId')
  async getByReviewAndActivity(
    @Param('reviewId') reviewId: string,
    @Param('activityId') activityId: string,
  ): Promise<Evidence[]> {
    return this.evidencesService.getEvidencesByReviewAndActivity(reviewId, activityId);
  }

  /**
   * GET /evidences/stats/:reviewId
   * Estadísticas de evidencias de una revisión
   */
  @Get('stats/:reviewId')
  async getStats(@Param('reviewId') reviewId: string) {
    return this.evidencesService.getEvidenceStats(reviewId);
  }

  /**
   * GET /evidences/:id
   * Obtener una evidencia específica
   */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Evidence> {
    return this.evidencesService.findById(id);
  }

  /**
   * PATCH /evidences/:id
   * Actualizar descripción o tipo de documento
   */
  @Patch(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateEvidenceDto: UpdateEvidenceDto,
  ): Promise<Evidence> {
    return this.evidencesService.update(id, updateEvidenceDto);
  }

  /**
   * DELETE /evidences/:id
   * Eliminación suave (soft delete)
   */
  @Delete(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async softDelete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    await this.evidencesService.softDelete(id);
    return { success: true, message: 'Evidencia eliminada' };
  }

  /**
   * DELETE /evidences/hard/:id
   * Eliminación permanente (solo admin)
   */
  @Delete('hard/:id')
  @Roles(UserRole.ADMIN)
  async hardDelete(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    await this.evidencesService.hardDelete(id);
    return { success: true, message: 'Evidencia eliminada permanentemente' };
  }

  /**
   * Inferir tipo de documento basado en MIME type
   */
  private inferDocumentType(mimeType: string): DocumentType {
    if (mimeType.includes('pdf')) return DocumentType.PDF;
    if (mimeType.includes('image')) return DocumentType.IMAGE;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return DocumentType.EXCEL;
    if (mimeType.includes('word') || mimeType.includes('document')) return DocumentType.WORD;
    if (mimeType.includes('video')) return DocumentType.VIDEO;
    if (mimeType.includes('audio')) return DocumentType.AUDIO;
    return DocumentType.OTHER;
  }
}
