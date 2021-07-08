import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { join } from "path";
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter);
  app.enableCors();
  //app.useStaticAssets(join(__dirname, '..', '..', 'client', 'dist'));
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
