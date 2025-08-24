import { getConfig } from '../../config/database';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from '../snake-naming.strategy';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();
const databaseConfig = getConfig();

const datasource = new DataSource({
  ...databaseConfig,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/core/database/migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
} as PostgresConnectionOptions);

export default datasource;
