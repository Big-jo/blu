import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ORDER } from '../../core/shared/types';
import { FindOptionsOrderValue } from 'typeorm';

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: ORDER, default: ORDER.ASC })
  @IsEnum(ORDER)
  @IsOptional()
  readonly order?: FindOptionsOrderValue = ORDER.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly pageSize?: number = 20;

  //TODO: Make a decision on whether to use this or not
  // @ApiPropertyOptional()
  // @Type(() => String)
  // @IsOptional()
  // readonly filter?: string;

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }
}
