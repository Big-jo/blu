import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto, MerchantReponseDto } from './merchant.dto';

@Controller('merchants')
@ApiTags('Merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  async create(
    @Body() createMerchantDto: CreateMerchantDto,
  ): Promise<MerchantReponseDto> {
    const merchant = await this.merchantService.create(createMerchantDto);
    return merchant.toDto();
  }
}
