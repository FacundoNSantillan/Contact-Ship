import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true,
      transform: true,            
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Contactship Mini API')
    .setDescription('API para la gestión de leads con integración de IA y sincronización externa')
    .setVersion('1.0')
    .addTag('leads')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key') 
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Documentation available on: http://localhost:${port}/api/docs`);
}

bootstrap();