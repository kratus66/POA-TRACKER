import { PartialType } from '@nestjs/mapped-types';
import { CreatePoaThemeDto } from './create-poa-theme.dto';

export class UpdatePoaThemeDto extends PartialType(CreatePoaThemeDto) {}
