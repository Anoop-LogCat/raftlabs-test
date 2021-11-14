import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { join } from 'path';
import { NotFoundExceptionFilter } from './filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'views'),
  });
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'pages/home/:pageId', 'pages/error', 'pages/works'],
  });
  await app.listen(3000);
}
bootstrap();
