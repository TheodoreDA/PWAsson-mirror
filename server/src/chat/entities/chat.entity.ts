import { ApiProperty } from '@nestjs/swagger';

export class Chat {
  @ApiProperty({ example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  uid: string;
  @ApiProperty({
    description: 'The participants',
    example: [
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ],
  })
  usersUid: string[];
  @ApiProperty({
    description: 'The UIDs of the messages',
    example: ['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
  })
  messagesUid: string[];

  toObject(): object {
    return {
      uid: this.uid,
      usersUid: this.usersUid,
      messagesUid: this.messagesUid,
    };
  }
}
