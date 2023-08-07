import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'tEsT'
      ? process.env.DB_NAME + '_test'
      : process.env.DB_NAME,
  logging: true,
  synchronize: true,
  name: 'default',
  migrationsTableName: 'migrations',
  entities: [join(__dirname, 'dist/src/entities/**.entity{.ts,.js}')],
  migrations: [join(__dirname, 'dist/src/migration/**/*{.ts,.js}')],
  subscribers: [join(__dirname, 'src/subscriber/**/*{.ts,.js}')],
};
console.log(options);

export const dataSourceConnection = new DataSource(options);
