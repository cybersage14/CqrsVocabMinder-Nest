import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth';
import { CommonModule } from './common';
import { ConfigModule } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { EnvModule } from './common/database/env.module';
import { CqrsModule } from '@nestjs/cqrs';
import { WordModule } from './modules/word/word.module';
import { WordsBoxModule } from './modules/wordsbox/wordsBox.module';
import { BoxModule } from './modules/box/box.module';

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
    BoxModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
