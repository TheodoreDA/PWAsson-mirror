import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { db } from 'src/database/app.database';
import { v4 as uuidv4 } from 'uuid';
import { messageBuilder } from 'src/builder/message.builder';
import { Query } from 'appwrite';
import { Models } from 'node-appwrite';
import { chatBuilder } from 'src/builder/chat.builder';

@Injectable()
export class MessageService {
  async create(connectedUserUid: string, createMessageDto: CreateMessageDto) {
    let doc: Models.Document;

    // check if chat exists
    try {
      doc = await db.getDocument('DEV', 'CHATS', createMessageDto.chatUid);
    } catch (e) {
      throw new NotFoundException('Could not find user.');
    }

    const chat = chatBuilder.buildFromDoc(doc);

    if (!chat.usersUid.includes(connectedUserUid)) {
      throw new BadRequestException(
        'Connected user has to be a participant of the chat.',
      );
    }

    // build local object
    const message = messageBuilder
      .setUid(uuidv4())
      .setChatUid(createMessageDto.chatUid)
      .setAuthorUid(connectedUserUid)
      .setContent(createMessageDto.content)
      .setSentAt(new Date())
      .build();

    // save it in database
    chat.messagesUid.push(message.uid);
    try {
      doc = await db.createDocument('DEV', 'MESSAGES', message.uid, message);
      await db.updateDocument('DEV', 'CHATS', chat.uid, chat);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return messageBuilder.buildFromDoc(doc);
  }

  async findAll(connectedUserUid: string, chatId: string, offset: number) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments('DEV', 'MESSAGES', [
        Query.equal('chatUid', chatId),
        Query.offset(offset),
      ]);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    return messageBuilder.buildFromDocs(docs);
  }

  async findOne(connectedUserUid: string, messageId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument('DEV', 'MESSAGES', messageId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const message = messageBuilder.buildFromDoc(doc);

    if (message.authorUid != connectedUserUid) {
      throw new UnauthorizedException(
        'Only owners can retreive their messages.',
      );
    }
    return message;
  }

  async remove(connectedUserUid: string, messageId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument('DEV', 'MESSAGES', messageId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const message = messageBuilder.buildFromDoc(doc);

    if (message.authorUid != connectedUserUid)
      throw new UnauthorizedException('Only owner can delete their messages.');

    try {
      doc = await db.getDocument('DEV', 'CHATS', message.chatUid);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const chat = chatBuilder.buildFromDoc(doc);

    if (!chat.messagesUid.includes(messageId))
      throw new BadRequestException('Message does not belong to the chat.');

    delete chat.messagesUid[chat.messagesUid.indexOf(messageId)];
    try {
      await db.deleteDocument('DEV', 'MESSAGES', messageId);
      await db.updateDocument('DEV', 'CHATS', message.chatUid, chat);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
