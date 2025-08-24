import { Controller } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger'; // Import ApiSecurity
import { WalletService } from './wallet.service';

@Controller('wallets')
@ApiTags('Wallets')
@ApiSecurity('x-api-key')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  //DEBUG: Uncomment to enable fetching all wallets (not recommended for production)
  // @Get()
  // async findAll(): Promise<WalletResponseDto[]> {
  //   const wallets = await this.walletService.findAll();
  //   return wallets.map((wallet) => wallet.toDto());
  // }
}
