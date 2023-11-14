export class Comment {
  uid: string;
  publicationUid: string;
  content: string;
  authorUid: string;
  likesUid: string[];
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
