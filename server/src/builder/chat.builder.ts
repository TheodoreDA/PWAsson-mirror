import { Chat } from 'src/chat/entities/chat.entity';
import { ABuilder } from './ABuilder';
import { Models } from 'node-appwrite';

export class ChatBuilder extends ABuilder<Chat> {
  private static _instance: ChatBuilder;

  reset(): ChatBuilder {
    this.object = new Chat();
    this.object.uid = '';
    this.object.usersUid = [];
    this.object.messagesUid = [];
    return this;
  }

  public static getInstance(): ChatBuilder {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): ChatBuilder {
    this.object.uid = uid;
    return this;
  }

  setUsersUid(usersUid: string[]): ChatBuilder {
    this.object.usersUid = usersUid;
    return this;
  }

  setMessagesUid(messagesUid: string[]): ChatBuilder {
    this.object.messagesUid = messagesUid;
    return this;
  }

  buildFromDoc(doc: Models.Document): Chat {
    this.setUid(doc['uid']);
    this.setUsersUid(doc['usersUid']);
    this.setMessagesUid(doc['messagesUid']);
    return this.build();
  }
}

const chatBuilder = ChatBuilder.getInstance();

export { chatBuilder };
