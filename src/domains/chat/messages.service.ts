import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './messages.model';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Messages) private messagesRepository: Repository<Messages>) {}

  async bulkInsertMessages(messages: Messages[]) {
    await this.messagesRepository.save(messages);
  }

  async getMessages(): Promise<Messages[]> {
    const messagesWithUserSecretData = await this.messagesRepository.find({
      join: {
        alias: 'message',
        innerJoinAndSelect: {
          id: 'message.user'
        }
      }
    });
    let messagesWithoutUserSecretData = [];
    for(let message of messagesWithUserSecretData) {
      messagesWithoutUserSecretData.push({...message, user: this.excludeUserSecretData(message.user) });
    }
    return messagesWithoutUserSecretData;
  }

  private excludeUserSecretData(user: any) {
    delete user.password;
    delete user.password_salt;
    delete user.email;
    return user;
  }
}