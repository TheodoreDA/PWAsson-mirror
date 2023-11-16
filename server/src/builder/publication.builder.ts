import { Publication } from 'src/publication/entities/publication.entity';
import { ABuilder } from './ABuilder';
import { Models } from 'node-appwrite';

export class PublicationBuilder extends ABuilder<Publication> {
  private static _instance: PublicationBuilder;

  reset(): PublicationBuilder {
    this.object = new Publication();
    this.object.likesUid = [];
    return this;
  }

  public static getInstance(): PublicationBuilder {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): PublicationBuilder {
    this.object.uid = uid;
    return this;
  }

  setTitle(title: string): PublicationBuilder {
    this.object.title = title;
    return this;
  }

  setDescription(description: string): PublicationBuilder {
    this.object.description = description;
    return this;
  }

  setAuthorUid(authorUid: string): PublicationBuilder {
    this.object.authorUid = authorUid;
    return this;
  }

  setPictureUid(pictureUid: string): PublicationBuilder {
    this.object.pictureUid = pictureUid;
    return this;
  }

  setLikesUid(likesUid: string[]): PublicationBuilder {
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

const publicationBuilder = PublicationBuilder.getInstance();

export { publicationBuilder };
