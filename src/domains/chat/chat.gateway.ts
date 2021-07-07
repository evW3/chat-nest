import {
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';

import { TokenService } from '../auth/token.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly tokenService: TokenService,
              private readonly usersService: UsersService) {}

  clients: any = {};
  chat: any = {};

  @SubscribeMessage('messageToServer')
  async message(client: any, ...args: any[]): Promise<void> {
    client.emit('message', args[0]);
  }

  async handleConnection(client: any, ...args: any[]): Promise<any> {
    const token = client.handshake.query.token;
    let isError = false;

    if(token) {
      const { id } = this.tokenService.decryptToken(token);

      if(id)
        this.clients[id] = client;
      else
        isError = true;

    } else
      isError = true;

    isError && client.emit('error', { message: 'Forbidden' })
  }

  handleDisconnect(client: any): any {
    console.log(this.clients, " [BEFORE]");
    for(let [key, savedClient] of Object.entries(this.clients)) {
      if(savedClient === client) {
        delete this.clients[key];
      }
    }
    console.log(this.clients, " [AFTER]");
  }
}