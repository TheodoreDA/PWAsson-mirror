import { Publication } from 'src/publication/entities/publication.entity';
import { AFactory } from './AFactory';
import { User } from 'src/user/entities/user.entity';
import { Models } from 'node-appwrite';

export class PublicationFactory extends AFactory<Publication> {
  private static _instance: PublicationFactory;

  reset(): PublicationFactory {
    this.object = new Publication();
    this.object.uid = '';
    this.object.title = '';
    this.object.description = '';
    this.object.author = undefined;
    this.object.pictureUid = '';
    this.object.likes = 0;
    return this;
  }

  public static getInstance(): PublicationFactory {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): PublicationFactory {
    this.object.uid = uid;
    return this;
  }

  setTitle(title: string): PublicationFactory {
    this.object.title = title;
    return this;
  }

  setDescription(description: string): PublicationFactory {
    this.object.description = description;
    return this;
  }

  setAuthor(author: User): PublicationFactory {
    this.object.author = author;
    return this;
  }

  setPictureUid(pictureUid: string): PublicationFactory {
    this.object.pictureUid = pictureUid;
    return this;
  }

  setLikes(likes: number): PublicationFactory {
    this.object.likes = likes;
    return this;
  }

  buildfromDoc(doc: Models.Document): Publication {
    this.setUid(doc['uid']);
    this.setTitle(doc['title']);
    this.setDescription(doc['description']);
    this.setAuthor(doc['author']['uid']);
    this.setPictureUid(doc['pictureUid']);
    this.setLikes(doc['likes']);
    return this.build();
  }
}

const publicationFactory = PublicationFactory.getInstance();

export { publicationFactory };
