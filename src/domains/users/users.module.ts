import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SMTPService } from './SMTP.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users])
  ],
  providers: [UsersService, SMTPService],
  exports: [UsersService, SMTPService]
})
export class UsersModule {}