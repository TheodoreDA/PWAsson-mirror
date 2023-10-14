import { User } from 'src/user/entities/user.entity';

export class Publication {
  uid: string;
  title: string;
  description: string;
  author: User;
  pictureUid: string;
  likes: number;

  toObject(): object {
    return {
      uid: this.uid,
      title: this.title,
      description: this.description,
      author: this.author?.uid ?? undefined,
      pictureUid: this.pictureUid,
      likes: this.likes,
    };
  }
}
