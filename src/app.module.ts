import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { CongestionModule } from './modules/congestion/congestion.module';
import { SecurityConfig } from './core/config/security';
import { AuthMiddleware } from './core/shared/middlewares/auth.middleware';
import { LoggerMiddleware } from './core/shared/middlewares/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

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
          // synchronize: true,
          // migrationsRun: true
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 100,
          ttl: 60,
        },
      ],
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
    CongestionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*customers', '*transactions', '*wallets');
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
