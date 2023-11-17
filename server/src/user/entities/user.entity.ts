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
  @ApiProperty({
    description: 'This section is use to know if the user allow the notifications, and if yes, to know the endpoint, expirationTime and keys to send the notifications',
  })
  isNotifAllowed: boolean;
  endpoint: string;
  expirationTime: number | null;
  p256dh: string;
  auth: string;

  toObject(): object {
    return {
      uid: this.uid,
      username: this.username,
      hash: this.hash,
      role: this.role,
      publicationsUid: this.publicationsUid,
      publicationsLikedUid: this.publicationsLikedUid,
      commentsLikedUid: this.commentsLikedUid,
      isNotifAllowed: this.isNotifAllowed,
      endpoint: this.endpoint,
      expirationTime: this.expirationTime,
      p256dh: this.p256dh,
      auth: this.auth,
    };
  }
}
