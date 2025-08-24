import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const environments = ['production', 'development', 'staging', 'test'] as const;
const logLevels: readonly LogLevel[] = [
  'debug',
  'error',
  'log',
  'verbose',
  'warn',
];

type Environment = (typeof environments)[number];

export type AppConfig = {
  name: string;
  environment: Environment;
  server: {
    port: number;
    host: string;
  };
  swagger: {
    enabled: boolean;
  };
  log: {
    name: string;
    level: LogLevel;
  };
  initialMerchantBalance: number;
};

const schema = Joi.object({
  name: Joi.string().required(),
  environment: Joi.string()
    .valid(...environments)
    .required(),
  server: Joi.object({
    port: Joi.number().required(),
    host: Joi.string().required(),
  }).required(),
  swagger: Joi.object({
    enabled: Joi.boolean().required(),
  }).required(),
  log: Joi.object({
    name: Joi.string().required(),
    level: Joi.string()
      .valid(...logLevels)
      .required(),
  }),
  initialMerchantBalance: Joi.number().required(),
});

export const getConfig = (): AppConfig => {
  const name = process.env.NAME || 'blu_backend';
  const environment = (process.env.ENVIRONMENT ||
    process.env.NODE_ENV ||
    'development') as Environment;

  return {
    name,
    environment,
    server: {
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT, 10) || 8000,
    },
    log: {
      name,
      level: (process.env.LOG_LEVEL || 'log') as LogLevel,
    },
    swagger: {
      enabled: process.env.SWAGGER_ENABLED === 'true',
    },
    initialMerchantBalance:
      Number(process.env.INITIAL_MERCHANT_BALANCE) || 10000000,
  };
};

export default registerAs('app', (): AppConfig => {
  const config = getConfig();
  Joi.assert(config, schema, 'App config validation failed');
  return config;
});
