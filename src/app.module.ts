import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth';
import { CommonModule } from './common';
import { ConfigModule, ConfigService } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'common/database/database.module';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: configService.get('DB_TYPE'),
    //       host: configService.get('DB_HOST'),
    //       port: configService.get('DB_PORT'),
    //       username: configService.get('DB_USERNAME'),
    //       password: configService.get('DB_PASSWORD'),
    //       database: configService.get('DB_DATABASE'),
    //       entities: [__dirname + './../**/**.entity{.ts,.js}'],
    //       synchronize: configService.get('DB_SYNC') === 'true',
    //     } as TypeOrmModuleAsyncOptions;
    //   },
    // }),
    DatabaseModule,
    ConfigModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
