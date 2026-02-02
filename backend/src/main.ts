import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { runSeeder } from './database/seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware
  app.use(cookieParser());

  // Ejecutar seeder en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    try {
      const dataSource = app.get(DataSource);
      await runSeeder(dataSource);
    } catch (error) {
      console.warn('[Bootstrap] No se pudo ejecutar el seeder:', error.message);
    }
  }

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('POA Tracker API')
    .setDescription('API para el sistema de seguimiento de POA')
    .setVersion('1.0')
    .addTag('health')
    .addTag('auth')
    .addTag('admin')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token en header o cookie',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
