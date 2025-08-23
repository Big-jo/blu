
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MerchantService } from './src/modules/merchant/merchant.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const merchantService = app.get(MerchantService);

  const merchant = await merchantService.create({
    name: 'k6-test-merchant',
    email: 'k6@test.com',
  });

  console.log(merchant.apiKey);

  await app.close();
}

bootstrap();
