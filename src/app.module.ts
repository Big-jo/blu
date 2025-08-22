import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './core/database/snake-naming.strategy';
import { DatabaseConfig } from './core/config/database';
import config from './core/config';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { MerchantModule } from './modules/merchant/merchant.module';

import { CustomerModule } from './modules/customer/customer.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SecurityConfig } from './core/config/security';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...config],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DatabaseConfig>(
          'database',
        ) as TypeOrmModuleOptions;
        return {
          ...config,
          namingStrategy: new SnakeNamingStrategy(),
          entities: [path.resolve(__dirname, 'modules/**/*.entity{.ts,.js}')],
          // migrations: [
          //   path.resolve(__dirname, 'core/database/**/*.entity{.ts,.js}'),
          // ],
          autoLoadEntities: false
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { jwtSecret, jwtExpiry } =
          configService.get<SecurityConfig>('security');

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiry },
        };
      },
    }),
    MerchantModule,
    CustomerModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
