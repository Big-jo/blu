import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger'; // Import ApiSecurity
import { WalletService } from './wallet.service';
import { WalletResponseDto } from './wallet.dto';

@Controller('wallets')
@ApiTags('Wallets')
@ApiSecurity('x-api-key') // Add ApiSecurity decorator
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async findAll(): Promise<WalletResponseDto[]> {
    const wallets = await this.walletService.findAll();
    return wallets.map((wallet) => wallet.toDto());
  }
}
