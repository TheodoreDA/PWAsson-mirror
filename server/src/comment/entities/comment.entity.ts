import { ApiProperty } from '@nestjs/swagger';

export class Comment {
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  uid: string;
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  publicationUid: string;
  @ApiProperty({
    example: 'This is quality content right there!',
  })
  content: string;
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  authorUid: string;
  @ApiProperty({
    example: [
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ],
  })
  likesUid: string[];
  @ApiProperty()
  createdAt: Date;

  toObject(): object {
    return {
      uid: this.uid,
      publicationUid: this.publicationUid,
      content: this.content,
      authorUid: this.authorUid,
      likesUid: this.likesUid,
      createdAt: this.createdAt,
    };
  }
}
