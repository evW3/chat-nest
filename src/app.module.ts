import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Users } from './domains/users/users.model';
import { ChatModule } from './domains/chat/chat.module';
import { Messages } from './domains/chat/messages.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${ process.env.NODE_ENV }.env`, '.env']
    }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number.parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      logging: false,
      database: process.env.POSTGRES_DB,
      migrations: ["src/migration/*.js"],
      entities: [Users, Messages],
      cli: {
        migrationsDir: "migration"
      }
    }),
    AuthModule,
    UsersModule,
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
