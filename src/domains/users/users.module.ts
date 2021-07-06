import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users])
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}