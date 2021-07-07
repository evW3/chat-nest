import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './bcrypt.service';
import { TokenService } from './token.service';
import { UsersModule } from '../users/users.module';
import { UniqueEmailMiddleware } from '../../middlewares/uniqueEmail.middleware';
import { IsExistsEmailMiddleware } from '../../middlewares/isExistsEmail.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
    }),
    UsersModule
  ],
  providers: [AuthService, BcryptService, TokenService],
  controllers: [AuthController],
  exports: [TokenService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UniqueEmailMiddleware)
      .forRoutes('auth/sign-up');
    consumer
      .apply(IsExistsEmailMiddleware)
      .forRoutes('auth/sign-in');
  }
}