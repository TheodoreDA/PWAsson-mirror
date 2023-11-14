import { Comment } from 'src/comment/entities/comment.entity';
import { AFactory } from './AFactory';
import { Models } from 'node-appwrite';

export class CommentFactory extends AFactory<Comment> {
  private static _instance: CommentFactory;

  reset(): CommentFactory {
    this.object = new Comment();
    this.object.likesUid = [];
    return this;
  }

  public static getInstance(): CommentFactory {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): CommentFactory {
    this.object.uid = uid;
    return this;
  }

  setPublicationUid(publicationUid: string): CommentFactory {
    this.object.publicationUid = publicationUid;
    return this;
  }

  setContent(content: string): CommentFactory {
    this.object.content = content;
    return this;
  }

  setAuthorUid(authorUid: string): CommentFactory {
    this.object.authorUid = authorUid;
    return this;
  }

  setLikesUid(likesUid: string[]): CommentFactory {
    this.object.likesUid = likesUid;
    return this;
  }

  setCreatedAt(createdAt: Date): CommentFactory {
    this.object.createdAt = createdAt;
    return this;
  }

  buildFromDoc(doc: Models.Document): Comment {
    this.setUid(doc['uid']);
    this.setPublicationUid(doc['publicationUid']);
    this.setContent(doc['content']);
    this.setAuthorUid(doc['authorUid']);
    this.setLikesUid(doc['likesUid']);
    this.setCreatedAt(new Date(doc['createdAt']));
    return this.build();
  }
}

const commentFactory = CommentFactory.getInstance();

export { commentFactory };
