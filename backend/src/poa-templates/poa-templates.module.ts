import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoaTemplatesService } from './poa-templates.service';
import { PoaTemplatesController } from './poa-templates.controller';
import { PoaTemplate } from './entities/poa-template.entity';
import { PoaTemplateActivity } from './entities/poa-template-activity.entity';
import { ProgramsModule } from '../programs/programs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PoaTemplate, PoaTemplateActivity]),
    ProgramsModule,
  ],
  providers: [PoaTemplatesService],
  controllers: [PoaTemplatesController],
  exports: [PoaTemplatesService],
})
export class PoaTemplatesModule {}
