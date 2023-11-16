import { Chat } from 'src/chat/entities/chat.entity';
import { AFactory } from './AFactory';
import { Models } from 'node-appwrite';

export class ChatFactory extends AFactory<Chat> {
  private static _instance: ChatFactory;

  reset(): ChatFactory {
    this.object = new Chat();
    this.object.uid = '';
    this.object.usersUid = [];
    this.object.messagesUid = [];
    return this;
  }

  public static getInstance(): ChatFactory {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): ChatFactory {
    this.object.uid = uid;
    return this;
  }

  setUsersUid(usersUid: string[]): ChatFactory {
    this.object.usersUid = usersUid;
    return this;
  }

  setMessagesUid(messagesUid: string[]): ChatFactory {
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

const chatFactory = ChatFactory.getInstance();

export { chatFactory };
