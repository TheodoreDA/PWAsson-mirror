import { User } from 'src/user/entities/user.entity';
import { Publication } from 'src/publication/entities/publication.entity';

export class Comment {
  uid: string;
  publication: Publication;
  content: string;
  author: User;
  likes: number;
  createdAt: Date;

  toObject(): object {
    return {
      uid: this.uid,
      publication: this.publication?.uid ?? undefined,
      content: this.content,
      author: this.author?.uid ?? undefined,
      likes: this.likes,
      createdAt: this.createdAt,
    };
  }
}
