import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewStatusDto } from './dtos/update-review-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear nueva revisión semestral' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de una revisión con validaciones' })
  async findById(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las revisiones' })
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de revisión' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(id, updateDto);
  }
}
