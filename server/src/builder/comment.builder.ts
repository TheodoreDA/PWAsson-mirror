import { Comment } from 'src/comment/entities/comment.entity';
import { ABuilder } from './ABuilder';
import { Models } from 'node-appwrite';

export class CommentBuilder extends ABuilder<Comment> {
  private static _instance: CommentBuilder;

  reset(): CommentBuilder {
    this.object = new Comment();
    this.object.likesUid = [];
    return this;
  }

  public static getInstance(): CommentBuilder {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): CommentBuilder {
    this.object.uid = uid;
    return this;
  }

  setPublicationUid(publicationUid: string): CommentBuilder {
    this.object.publicationUid = publicationUid;
    return this;
  }

  setContent(content: string): CommentBuilder {
    this.object.content = content;
    return this;
  }

  setAuthorUid(authorUid: string): CommentBuilder {
    this.object.authorUid = authorUid;
    return this;
  }

  setLikesUid(likesUid: string[]): CommentBuilder {
    this.object.likesUid = likesUid;
    return this;
  }

  setCreatedAt(createdAt: Date): CommentBuilder {
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

const commentBuilder = CommentBuilder.getInstance();

export { commentBuilder };
