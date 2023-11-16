export class Message {
  uid: string;
  chatUid: string;
  authorUid: string;
  content: string;
  sentAt: Date;

  toObject(): object {
    return {
      uid: this.uid,
      chatUid: this.chatUid,
      authorUid: this.authorUid,
      content: this.content,
      sentAt: this.sentAt,
    };
  }
}
