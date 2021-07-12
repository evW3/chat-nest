import {
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {v4 as uuid} from 'uuid';

import { TokenService } from '../auth/token.service';
import { UsersService } from '../users/users.service';
import { Messages } from './messages.model';
import { MessagesService } from './messages.service';
import { Users } from '../users/users.model';
import { Cron, CronExpression } from '@nestjs/schedule';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly tokenService: TokenService, private readonly usersService: UsersService, private readonly messagesService: MessagesService) {
    (async () => {this.chat = await this.messagesService.getMessages()})();

  }

  clients: any = {};
  chat: Messages[] = [];
  lastMessageId: number = 0;

  @SubscribeMessage('chatMessage')
  async message(client: any, ...args: any[]): Promise<void> {
    const token = args[0].token;
    const newChatMessage = args[0].message;

    if(token && newChatMessage) {
      const { id } = this.tokenService.decryptToken(token);
      if(id) {
        const user = new Users();
        const message = new Messages();

        user.id = id;

        message.date = new Date();
        message.message = newChatMessage;
        message.user = user;

        this.chat.push(message);
        this.sendNewMessageToClient(message);
      } else {
        //Here i can exclude user without incorrect token
      }
    } else {
      //Here i can exclude user without token
    }
  }

  @SubscribeMessage('getChatHistory')
  getChatHistory(client: any, ...args: any[]) {
    client.emit('initChat', this.chat);
  }

  sendNewMessageToClient(message: any) {
    Object.values(this.clients).forEach((client: any) => client.emit('newMessage', message));
  }

  async handleConnection(client: any, ...args: any[]): Promise<any> {
    try {
      const token = client.handshake.query.token;

      if(token) {
        const { id } = this.tokenService.decryptToken(token);

        if(id)
          this.clients[id] = client;

      }

    } catch (e) {}
  }

  @Cron(process.env.CHAT_SAVE_DELAY)
  async saveChat() {
    let tmpChat = [];
    if(this.lastMessageId - this.chat.length) {
      for(let i = this.lastMessageId; i < this.chat.length; i++) {
        tmpChat.push(this.chat[i]);
      }
      this.lastMessageId = this.chat.length;
      await this.messagesService.bulkInsertMessages(tmpChat);
    }
  }

  handleDisconnect(client: any): any {
    //console.log(this.clients, " [BEFORE]");
    for(let [key, savedClient] of Object.entries(this.clients)) {
      if(savedClient === client) {
        delete this.clients[key];
      }
    }
    //console.log(this.clients, " [AFTER]");
  }
}