import { ApiProperty } from '@nestjs/swagger';

export class Publication {
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  uid: string;
  @ApiProperty({
    example: 'Super title!',
  })
  title: string;
  @ApiProperty({
    example: 'Super description!',
  })
  description: string;
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  authorUid: string;
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  pictureUid: string;
  @ApiProperty({
    example: [
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ],
  })
  likesUid: string[];

  toObject(): object {
    return {
      uid: this.uid,
      title: this.title,
      description: this.description,
      authorUid: this.authorUid,
      pictureUid: this.pictureUid,
      likesUid: this.likesUid,
    };
  }
}
