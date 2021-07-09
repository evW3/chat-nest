import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Messages } from './messages.model';
import { ChatGateway } from './chat.gateway';
import { Users } from '../users/users.model';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env']
    }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
    }),
    TypeOrmModule.forFeature([Messages, Users]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ChatGateway, MessagesService]
})
export class ChatModule {}