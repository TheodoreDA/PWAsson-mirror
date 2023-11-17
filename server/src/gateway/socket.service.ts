import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'appwrite';
import { Socket } from 'socket.io';
import { Chat } from 'src/chat/entities/chat.entity';
import { Message } from 'src/message/entities/message.entity';
import { Publication } from 'src/publication/entities/publication.entity';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  private safeVerifyToken(token: string): Payload | null {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      return null;
    }
  }

  private getClientUidFromHeader(client: Socket) {
    let clientId: string | null;

    if (
      client.handshake.headers.authorization &&
      client.handshake.headers.authorization.startsWith('Bearer ')
    ) {
      const token = client.handshake.headers.authorization.substring(7);

      clientId = this.safeVerifyToken(token)?.uid;
    } else {
      clientId = null;
    }
    return clientId;
  }

  handleConnection(socket: Socket): void {
    const clientId = this.getClientUidFromHeader(socket);

    this.connectedClients.set(clientId, socket);
    console.log('New connection: ', clientId);

    socket.on('disconnect', () => {
      console.log('Lost connection: ', clientId);
      this.connectedClients.delete(clientId);
    });
  }

  emitEventToAll(eventName: EventNames, data: object) {
    this.connectedClients.forEach((client) => {
      console.log('Emitting a "' + eventName + '" event');
      client.emit(eventName, data);
    });
  }

  emitEventToUsers(eventName: EventNames, uids: string[], data: object) {
    this.connectedClients.forEach((client: Socket, uid: string) => {
      if (uid != null && uid != undefined && uids.includes(uid)) {
        console.log('Emitting a "' + eventName + '" event to ' + uid);
        client.emit(eventName, data);
      }
    });
  }

  emitNewPublication(publication: Publication) {
    this.emitEventToAll('on-new-publication', publication);
  }

  emitNewMessage(receivers: string[], message: Message) {
    this.emitEventToUsers('on-new-message', receivers, message);
  }

  onNewMessage(client: Socket, chat: Chat, message: Message) {
    const clientId = this.getClientUidFromHeader(client);

    if (
      clientId == null ||
      clientId != message.authorUid ||
      !chat.usersUid.includes(clientId)
    ) {
      throw new UnauthorizedException(
        'Only participants can send messages to this chat.',
      );
    }

    this.emitEventToUsers(
      'on-new-message',
      chat.usersUid.filter((uid) => uid != message.authorUid),
      message,
    );
  }
}

export type EventNames = 'on-new-publication' | 'on-new-message';
