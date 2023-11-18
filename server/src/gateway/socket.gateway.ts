import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { Message } from 'src/message/entities/message.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  @SubscribeMessage('new-message')
  onNewMessage(
    @MessageBody() body: any,
    @MessageBody('chat') chat: Chat,
    @MessageBody('message') message: Message,
    @ConnectedSocket() client: Socket,
  ): void {
    this.socketService.onNewMessage(client, chat, message);
  }
}
