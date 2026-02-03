import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoaTheme } from './entities/poa-theme.entity';
import { PoaThemesService } from './poa-themes.service';
import { PoaThemesController } from './poa-themes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PoaTheme])],
  providers: [PoaThemesService],
  controllers: [PoaThemesController],
  exports: [PoaThemesService],
})
export class PoaThemesModule {}
