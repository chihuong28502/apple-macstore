import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BlockApiGuard } from './guards/blockApi.guard';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new BlockApiGuard(reflector));
  await app.listen(3000);
  console.log(
    `Listen heath_backend connect Db: ${configService.get<string>('MONGODB_URI', 'localhost:27017')} and RabbitMQ: ${configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')}with env ${configService.get<string>('NODE_ENV', 'dev')}`,
  );
}
bootstrap();
