import { Role } from './role';

export class User {
  uid: string;
  username: string;
  hash: string;
  role: Role;
  publicationsUid: string[];
  publicationsLikedUid: string[];
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
