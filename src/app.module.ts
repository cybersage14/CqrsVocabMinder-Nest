import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth';
import { CommonModule } from './common';
import { ConfigModule, ConfigService } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { EnvModule } from './common/database/env.module';
import { CqrsModule } from '@nestjs/cqrs';
import { WordModule } from './modules/word/word.module';
import { WordsBoxModule } from './modules/wordsBox/wordsBox.module';
import { BoxModule } from './modules/box/box.module';
import { ThrottlerAsyncOptions, ThrottlerGuard, ThrottlerModule, ThrottlerOptions, seconds } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { Redis } from 'ioredis';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    AuthModule,
    CommonModule,
    EnvModule,
    CqrsModule,
    WordModule,
    WordsBoxModule,
    BoxModule,
    // throttlers: [{ limit: 5, ttl: seconds(60) }],
    // storage: new ThrottlerStorageRedisService(new Redis('redis://127.0.0.1:6379'))
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            limit: Number(config.get('THROTTLE_LIMIT')),
            ttl: Number(config.get('THROTTLE_TTL')),
          },
        ],
        // TODO: refactor redis config
        storage: new ThrottlerStorageRedisService(new Redis(config.get('REDIS_URL'))),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }],
})
export class AppModule { }
