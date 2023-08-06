import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SortEnum } from '../enums/sort.enum';

export class SortRequestDto {
  @ApiPropertyOptional({ enum: SortEnum })
  @IsOptional()
  @IsEnum(SortEnum)
  sortType?: SortEnum = SortEnum.DESC;

  @IsOptional()
  sort?: any;
}
