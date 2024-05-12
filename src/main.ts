import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('XBillPay Agent-Auth-Service API Documentation')
    .setVersion(app.get(ConfigService).get('api.version'))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(app.get(ConfigService).get('port'));
}
bootstrap();
