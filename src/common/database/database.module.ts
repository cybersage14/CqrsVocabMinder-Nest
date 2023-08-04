import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

// import { EnvModule } from './env.module';
import * as dotenv from 'dotenv';
import { Entities } from 'entitys';


// import { EnvService } from './env.service';
dotenv.config();

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database:
    process.env.NODE_ENV === 'tEsT'
      ? process.env.DB_NAME + '_test'
      : process.env.DB_NAME || 'postgres',
  entities: Entities,
  migrationsRun: true,
  synchronize: false,
};
function DatabaseOrmModule(): DynamicModule {
  // const config = new EnvService().read();

  return TypeOrmModule.forRoot(options);
}

@Global()
@Module({
  imports: [DatabaseOrmModule()],
  // imports: [EnvModule, DatabaseOrmModule()],
})
export class DatabaseModule {}
