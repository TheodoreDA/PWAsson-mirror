export class Publication {
  uid: string;
  title: string;
  description: string;
  authorUid: string;
  pictureUid: string;
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
