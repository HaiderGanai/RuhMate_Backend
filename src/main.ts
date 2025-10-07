import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   //removes peroperties not in the DTO
      forbidNonWhitelisted: true, // throws error if extra fieds are sent
      transform: true,  //auto transforms payloads intro DTO classes
    })
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // to disable sending the password field in json response
  app.enableCors(); 

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0'); 
}
bootstrap();
