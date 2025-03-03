import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtStrategy } from './config/strategies/jwt.strategy';
import * as dotenv from "dotenv";
import * as passport from 'passport';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME + ' API')
    .setDescription('### API for ' + process.env.APP_NAME)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.use(passport.initialize());
  passport.use('jwt', app.get(JwtStrategy))

  await app.listen(process.env.APP_PORT);
}
bootstrap();
