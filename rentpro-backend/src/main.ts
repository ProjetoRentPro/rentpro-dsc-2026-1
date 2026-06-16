import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // PDF 04 — CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // PDF 05 — Versionamento por URI (/v1/...)
  app.enableVersioning({ type: VersioningType.URI });

  // PDF 04 — Validação automática dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // PDF 03 — Filtro global de exceções padronizado
  app.useGlobalFilters(new HttpExceptionFilter());

  // PDF 01 — Swagger (desabilitado em produção)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('RentPro API')
      .setDescription('API de gerenciamento de locação de equipamentos')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Aplicacao rodando em http://localhost:${port}`);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Swagger disponivel em http://localhost:${port}/api/docs`);
  }
}
bootstrap();
