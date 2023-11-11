import { Comment } from 'src/comment/entities/comment.entity';
import { AFactory } from './AFactory';
import { User } from 'src/user/entities/user.entity';
import { Publication } from 'src/publication/entities/publication.entity';
import { Models } from 'node-appwrite';

export class CommentFactory extends AFactory<Comment> {
  private static _instance: CommentFactory;

  reset(): CommentFactory {
    this.object = new Comment();
    this.object.uid = '';
    this.object.publication = undefined;
    this.object.content = '';
    this.object.author = undefined;
    this.object.likes = 0;
    this.object.createdAt = undefined;
    return this;
  }

  public static getInstance(): CommentFactory {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): CommentFactory {
    this.object.uid = uid;
    return this;
  }

  setPublication(publication: Publication): CommentFactory {
    this.object.publication = publication;
    return this;
  }

  setContent(content: string): CommentFactory {
    this.object.content = content;
    return this;
  }

  setAuthor(author: User): CommentFactory {
    this.object.author = author;
    return this;
  }

  setLikes(likes: number): CommentFactory {
    this.object.likes = likes;
    return this;
  }

  setCreatedAt(createdAt: Date): CommentFactory {
    this.object.createdAt = createdAt;
    return this;
  }

  buildfromDoc(doc: Models.Document): Comment {
    this.setUid(doc['uid']);
    this.setPublication(doc['publication']['uid']);
    this.setContent(doc['content']);
    this.setAuthor(doc['author']['uid']);
    this.setLikes(doc['likes']);
    this.setCreatedAt(new Date(doc['createdAt']));
    return this.build();
  }
}

const commentFactory = CommentFactory.getInstance();

export { commentFactory };
