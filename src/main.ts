import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';
import { AppConfig } from './core/config/app';
import { TrimWhitespacePipe } from './core/shared/pipes/trim-whitespace.pipe';
import {
  SWAGGER_VERSION,
  SWAGGER_TITLE,
  SWAGGER_RELATIVE_URL,
} from './core/shared/constants/index';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
});

  const configService = app.get(ConfigService);
  const { server, swagger, environment } = configService.get<AppConfig>('app');

  const whitelist = [
    // Add whitelists here
  ];

  // Enable localhost on dev/staging servers only
  if (environment === 'development') {
    whitelist.push(/http(s)?:\/\/localhost:/);
  } else {
    app.use(helmet());
  }

  // cors options
  const options = {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-control',
      'If-None-Match',
      'Access-Control-Allow-Origin',
    ],
    credentials: true,
  };
  app.enableCors(options);

  app
    .useGlobalPipes(
      new TrimWhitespacePipe(),
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .setGlobalPrefix('api/v1');

  app.useBodyParser('json', { limit: '50mb' });
  console.log(swagger.enabled);

  if (swagger.enabled && environment !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .addBearerAuth()
      .addApiKey(
        { type: 'apiKey', name: 'x-api-key', in: 'header' },
        'x-api-key',
      )
      .build();

    const swaggerConfigOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'method',
        persistAuthorization: true,
        docExpansion: 'none',
      },
    };

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      SWAGGER_RELATIVE_URL,
      app,
      document,
      swaggerConfigOptions,
    );
  }
  await app.listen(server.port);

  Logger.log(`Server running on port: ${server.port}`);
}
void bootstrap();
