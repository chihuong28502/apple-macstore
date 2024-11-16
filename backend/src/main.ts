import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BlockApiGuard } from './common/guards/blockApi.guard';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);  const configService = app.get(ConfigService);

  const corsOrigins = configService.get<string>('CORS_ORIGIN', '').split(',');
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new BlockApiGuard(reflector));
  app.enableCors({
    origin: corsOrigins.length > 1 ? corsOrigins : corsOrigins[0],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization','X-Lang'],
    credentials: true, 
  });
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(configService.get<string>('PORT', '3000'));

  console.log(
    `    - Listen BACKEND:
    - PORT: ${configService.get<string>('PORT', '3000')} 
    - CONNECTDB: ${configService.get<string>('MONGODB_URI', 'localhost:27017').slice(0,90)} 
    - ENV: ${configService.get<string>('NODE_ENV', 'dev')}`,
  );
}
bootstrap();
