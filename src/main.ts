import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { TrimStringsPipe } from './common/transformer/trim-strings.pipe';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  // swagger
  setupSwagger(app);

  app.enableCors();
  // pipe
  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());
  // interceptor 
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  // container for validator 
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, async () => {
    console.log(`listening on port ${await app.getUrl()}`);
  });
}

bootstrap();
