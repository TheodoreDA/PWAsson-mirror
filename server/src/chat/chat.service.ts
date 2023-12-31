import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { db } from 'src/database/app.database';
import { v4 as uuidv4 } from 'uuid';
import { chatBuilder } from 'src/builder/chat.builder';
import { Query } from 'appwrite';
import { Models } from 'node-appwrite';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ChatService {
  private readonly notificationService: NotificationService;
  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async create(connectedUserUid: string, createChatDto: CreateChatDto) {
    let doc: Models.Document;

    // check if users exist
    try {
      for (let i = 0; i < createChatDto.usersUid.length; i++) {
        await db.getDocument('DEV', 'USERS', createChatDto.usersUid[i], [
          Query.select(['uid']),
        ]);
      }
    } catch (e) {
      throw new NotFoundException('Could not find user.');
    }

    if (
      createChatDto.usersUid.length == 1 &&
      createChatDto.usersUid[0] == connectedUserUid
    ) {
      throw new BadRequestException(
        'Cannot create chat with only the connected user.',
      );
    }
    if (!createChatDto.usersUid.includes(connectedUserUid))
      createChatDto.usersUid.push(connectedUserUid);

    // build local object
    const chat = chatBuilder
      .setUid(uuidv4())
      .setUsersUid(createChatDto.usersUid)
      .build();

    // save it in database
    try {
      doc = await db.createDocument('DEV', 'CHATS', chat.uid, chat);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    // notify the other user that someone wants to chat with him
    this.notificationService.notifyUserOfNewConversation(createChatDto.usersUid)


    return chatBuilder.buildFromDoc(doc);
  }

  async findAll(connectedUserUid: string) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments('DEV', 'CHATS', [
        Query.search('usersUid', connectedUserUid),
      ]);
    } catch (e) {
      throw new NotFoundException('UnknownException: ' + e.message);
    }

    return chatBuilder.buildFromDocs(docs);
  }

  async findOne(connectedUserUid: string, chatId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument('DEV', 'CHATS', chatId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const chat = chatBuilder.buildFromDoc(doc);

    if (!chat.usersUid.includes(connectedUserUid)) {
      throw new UnauthorizedException(
        'Only participants can retreive their chats.',
      );
    }
    return chat;
  }

  async remove(connectedUserUid: string, chatId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument('DEV', 'CHATS', chatId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const chat = chatBuilder.buildFromDoc(doc);
    if (!chat.usersUid.includes(connectedUserUid)) {
      throw new UnauthorizedException(
        'Only participants can leave their chats.',
      );
    }

    if (chat.usersUid.length == 1) {
      // Delete all messages of chat
      for (let i = 0; i < chat.messagesUid.length; i++) {
        try {
          await db.deleteDocument('DEV', 'MESSAGES', chat.messagesUid[i]);
        } catch {}
      }
      // Delete chat
      try {
        await db.deleteDocument('DEV', 'CHATS', chatId);
      } catch (e) {
        throw new BadRequestException('UnknownException: ' + e.message);
      }
    } else {
      // Remove connected user from chat
      chat.usersUid = chat.usersUid.filter((uid) => uid != connectedUserUid);
      try {
        await db.updateDocument('DEV', 'CHATS', chatId, chat);
      } catch (e) {
        throw new BadRequestException('UnknownException: ' + e.message);
      }
    }
  }
}
