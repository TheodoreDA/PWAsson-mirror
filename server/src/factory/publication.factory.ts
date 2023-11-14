import { Publication } from 'src/publication/entities/publication.entity';
import { AFactory } from './AFactory';
import { Models } from 'node-appwrite';

export class PublicationFactory extends AFactory<Publication> {
  private static _instance: PublicationFactory;

  reset(): PublicationFactory {
    this.object = new Publication();
    this.object.likesUid = [];
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

  setAuthorUid(authorUid: string): PublicationFactory {
    this.object.authorUid = authorUid;
    return this;
  }

  setPictureUid(pictureUid: string): PublicationFactory {
    this.object.pictureUid = pictureUid;
    return this;
  }

  setLikesUid(likesUid: string[]): PublicationFactory {
    this.object.likesUid = likesUid;
    return this;
  }

  buildFromDoc(doc: Models.Document): Publication {
    this.setUid(doc['uid']);
    this.setTitle(doc['title']);
    this.setDescription(doc['description']);
    this.setAuthorUid(doc['authorUid']);
    this.setPictureUid(doc['pictureUid']);
    this.setLikesUid(doc['likesUid']);
    return this.build();
  }
}

const publicationFactory = PublicationFactory.getInstance();

export { publicationFactory };
