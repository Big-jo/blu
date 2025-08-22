import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export type SecurityConfig = {
  jwtExpiry: number | string;
  jwtSecret: string;
  saltRounds: number;
  resetTokenExpiry: number | string;
  verificationExpiry: number | string;
};

const schema = Joi.object<SecurityConfig>({
  jwtExpiry: Joi.alternatives(Joi.string(), Joi.number()).required(),
  jwtSecret: Joi.string().required(),
  saltRounds: Joi.number(),
  resetTokenExpiry: Joi.alternatives(Joi.string(), Joi.number()).required(),
  verificationExpiry: Joi.alternatives(Joi.string(), Joi.number()).required(),
});

export const getConfig = (): SecurityConfig => ({
  jwtExpiry: process.env.JWT_EXPIRY || '3d',
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: Number(process.env.SALT_ROUNDS) || 10,
  resetTokenExpiry: process.env.RESET_TOKEN_EXPIRY || '1h',
  verificationExpiry: process.env.VERIFICATION_EXPIRY || '30m',
});

/* istanbul ignore next */
export default registerAs('security', () => {
  const config = getConfig();
  Joi.assert(config, schema, 'Security config validation failed.');
  return config;
});
