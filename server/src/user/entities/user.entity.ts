import { Publication } from 'src/publication/entities/publication.entity';
import { Role } from './role';

export class User {
  uid: string;
  username: string;
  hash: string;
  role: Role;
  publications: Publication[];
  publicationsLiked: Publication[];

  toObject(): object {
    return {
      uid: this.uid,
      username: this.username,
      hash: this.hash,
      role: this.role,
      publications: this.publications.map((pub) => pub.uid),
      publicationsLiked: this.publicationsLiked.map((pub) => pub.uid),
    };
  }
}
