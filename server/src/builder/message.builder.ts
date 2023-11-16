import { Message } from 'src/message/entities/message.entity';
import { ABuilder } from './ABuilder';
import { Models } from 'node-appwrite';

export class MessageBuilder extends ABuilder<Message> {
  private static _instance: MessageBuilder;

  reset(): MessageBuilder {
    this.object = new Message();
    this.object.uid = '';
    return this;
  }

  public static getInstance(): MessageBuilder {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): MessageBuilder {
    this.object.uid = uid;
    return this;
  }

  setChatUid(chatUid: string): MessageBuilder {
    this.object.chatUid = chatUid;
    return this;
  }

  setAuthorUid(authorUid: string): MessageBuilder {
    this.object.authorUid = authorUid;
    return this;
  }

  setContent(content: string): MessageBuilder {
    this.object.content = content;
    return this;
  }

  setSentAt(sentAt: Date): MessageBuilder {
    this.object.sentAt = sentAt;
    return this;
  }

  buildFromDoc(doc: Models.Document): Message {
    this.setUid(doc['uid']);
    this.setChatUid(doc['chatUid']);
    this.setAuthorUid(doc['authorUid']);
    this.setContent(doc['content']);
    this.setSentAt(new Date(doc['sentAt']));
    return this.build();
  }
}

const messageBuilder = MessageBuilder.getInstance();

export { messageBuilder };
