import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter);
  app.enableCors();
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
