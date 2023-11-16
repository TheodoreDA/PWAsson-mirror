import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { db } from 'src/database/app.database';
import { v4 as uuidv4 } from 'uuid';
import { chatFactory } from 'src/factory/chat.factory';
import { Query } from 'appwrite';
import { Models } from 'node-appwrite';

@Injectable()
export class ChatService {
  async create(connectedUserUid: string, createChatDto: CreateChatDto) {
    let doc: Models.Document;

    // check if users exist
    try {
      for (let i = 0; i < createChatDto.usersUid.length; i++) {
        doc = await db.getDocument('DEV', 'USERS', createChatDto.usersUid[i], [
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
      throw new BadRequestException('Cannot create chat with only one user.');
    }
    if (!createChatDto.usersUid.includes(connectedUserUid))
      createChatDto.usersUid.push(connectedUserUid);

    // build local object
    const chat = chatFactory
      .setUid(uuidv4())
      .setUsersUid(createChatDto.usersUid)
      .build();

    // save it in database
    try {
      doc = await db.createDocument('DEV', 'CHATS', chat.uid, {
        ...chat.toObject(),
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return chatFactory.buildFromDoc(doc);
  }

  async findAll(connectedUserUid: string) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments('DEV', 'CHATS', [
        Query.search('usersUid', connectedUserUid),
      ]);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    // TODO: refactor this with buildFromDocs
    return docs.documents.map((doc) => chatFactory.buildFromDoc(doc));
  }

  async findOne(connectedUserUid: string, chatId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument('DEV', 'CHATS', chatId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const chat = chatFactory.buildFromDoc(doc);

    if (!chat.usersUid.includes(connectedUserUid)) {
      throw new UnauthorizedException(
        'Only participants can retreive their conversations.',
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

    const chat = chatFactory.buildFromDoc(doc);
    if (!chat.usersUid.includes(connectedUserUid)) {
      throw new UnauthorizedException(
        'Only participants can leave their conversations.',
      );
    }

    if (chat.usersUid.length == 1) {
      // TODO: delete all messages
      try {
        await db.deleteDocument('DEV', 'CHATS', chatId);
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    } else {
      delete chat.usersUid[chat.usersUid.indexOf(connectedUserUid)];
      try {
        await db.updateDocument('DEV', 'CHATS', chatId, chat);
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    }
  }
}
