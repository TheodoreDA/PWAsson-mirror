import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role';

export class User {
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  uid: string;
  @ApiProperty({
    example: 'YourUsername',
  })
  username: string;
  @ApiProperty({
    example: 'Hashed password',
  })
  hash: string;
  @ApiProperty({
    example: 'user | admin',
  })
  role: Role;
  @ApiProperty({
    example: [
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ],
  })
  publicationsUid: string[];
  @ApiProperty({
    example: [
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ],
  })
  publicationsLikedUid: string[];
  @ApiProperty({
    example: [
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ],
  })
  commentsLikedUid: string[];

  toObject(): object {
    return {
      uid: this.uid,
      username: this.username,
      hash: this.hash,
      role: this.role,
      publicationsUid: this.publicationsUid,
      publicationsLikedUid: this.publicationsLikedUid,
      commentsLikedUid: this.commentsLikedUid,
    };
  }
}
