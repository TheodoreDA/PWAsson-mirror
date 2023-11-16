import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  uid: string;
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  chatUid: string;
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  authorUid: string;
  @ApiProperty({
    example: 'Hello world! :)',
  })
  content: string;
  @ApiProperty()
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
