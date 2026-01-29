import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PoaTemplatesService } from './poa-templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  CreatePoaTemplateDto,
  UpdatePoaTemplateDto,
  CreatePoaTemplateActivityDto,
  PoaTemplateFilterDto,
} from './dtos/poa-template.dto';

@Controller('poa-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PoaTemplatesController {
  constructor(private readonly poaTemplatesService: PoaTemplatesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA)
  async create(@Body() createTemplateDto: CreatePoaTemplateDto) {
    return this.poaTemplatesService.create(createTemplateDto);
  }

  @Get()
  async findAll(@Query() filterDto: PoaTemplateFilterDto) {
    return this.poaTemplatesService.findAll(filterDto);
  }

  @Get('active/list')
  async getActiveTemplates() {
    return this.poaTemplatesService.getActiveTemplates();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.poaTemplatesService.findById(id);
  }

  @Get(':id/activities')
  async getActivities(@Param('id') id: string) {
    return this.poaTemplatesService.getActivitiesByTemplate(id);
  }

  @Post(':id/activities')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA)
  async addActivity(
    @Param('id') templateId: string,
    @Body() createActivityDto: CreatePoaTemplateActivityDto,
  ) {
    return this.poaTemplatesService.addActivity(templateId, createActivityDto);
  }

  @Delete(':templateId/activities/:activityId')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA)
  async removeActivity(
    @Param('templateId') templateId: string,
    @Param('activityId') activityId: string,
  ) {
    return this.poaTemplatesService.removeActivity(templateId, activityId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA)
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdatePoaTemplateDto,
  ) {
    return this.poaTemplatesService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.poaTemplatesService.remove(id);
  }
}
