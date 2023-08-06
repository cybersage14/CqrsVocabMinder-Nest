import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from '../utils/validator';

export class FilterRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  getAll?: boolean;

  @IsOptional()
  filters?: any;
}
