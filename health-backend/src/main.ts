import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BlockApiGuard } from './common/guards/blockApi.guard';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new BlockApiGuard(reflector));
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
  await app.listen(configService.get<string>('PORT', '3000'));

  console.log(
    `Listen heath_backend port ${configService.get<string>('PORT', '3000')}  connect Db: ${configService.get<string>('MONGODB_URI', 'localhost:27017')} with env ${configService.get<string>('NODE_ENV', 'dev')}`,
  );
}
bootstrap();
