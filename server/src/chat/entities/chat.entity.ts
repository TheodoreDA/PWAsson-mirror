export class Chat {
  uid: string;
  usersUid: string[];
  messagesUid: string[];

  toObject(): object {
    return {
      uid: this.uid,
      usersUid: this.usersUid,
      messagesUid: this.messagesUid,
    };
  }
}
