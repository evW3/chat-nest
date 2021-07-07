import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  async saveUser(user: Users): Promise<Users> {
    return await this.usersRepository.save(user);
  }

  async isExistsEmail(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { email } });
    return count === 1;
  }

  async getUserByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOne({ where: { email } });
  }
}