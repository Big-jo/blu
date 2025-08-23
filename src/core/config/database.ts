import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseType } from 'typeorm';

export interface DatabaseConfig {
  type: DatabaseType;
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
  synchronize: boolean;
  logging: boolean;
  autoLoadEntities: boolean;
  ssl: Record<string, unknown>;
}

const schema = Joi.object<DatabaseConfig>({
  type: Joi.string().required(),
  database: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(3).required(),
  port: Joi.number().integer().min(0).required(),
  host: Joi.string().min(5).required(),
  autoLoadEntities: Joi.boolean().required(),
  logging: Joi.array().required(),
  synchronize: Joi.boolean().required(),
  ssl: Joi.object().optional().allow(null),
});

export const getConfig = (): DatabaseConfig => {
  const config = {
    type: (process.env.DATABASE_TYPE || 'postgres') as DatabaseType,
    database: process.env.DATABASE_NAME || 'blu-db',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: ['query', 'schema'] as any,
    autoLoadEntities: false,
    ssl: null,
  };

  if (process.env.ENVIRONMENT === 'production') {
    config.ssl = {
      rejectUnauthorized:
        process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true',
      // ca: process.env.DATABASE_CERT,
    };
  }

  return config;
};

export default registerAs('database', (): DatabaseConfig => {
  const config = getConfig();
  Joi.assert(config, schema, 'Database config validation failed');
  return config;
});
