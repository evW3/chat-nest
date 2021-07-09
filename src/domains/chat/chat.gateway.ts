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

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly tokenService: TokenService,
              private readonly usersService: UsersService) {}

  clients: any = {};
  chat: any = [];
  lastMessageId: number;

  @SubscribeMessage('chatMessage')
  async message(client: any, ...args: any[]): Promise<void> {
    const token = args[0].token;
    const newChatMessage = args[0].message;

    if(token && newChatMessage) {
      const { id } = this.tokenService.decryptToken(token);
      if(id) {
        const message = { text: newChatMessage, date: new Date() };
        const chatObj = { userId: id, message };
        this.chat.push(chatObj);
        this.sendNewMessageToClient(chatObj);
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