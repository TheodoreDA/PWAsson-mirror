import { Publication } from 'src/publication/entities/publication.entity';
import { IFactory } from './IFactory';

export class PublicationFactory implements IFactory<Publication> {
  private static _instance: PublicationFactory;
  private publication: Publication;

  private constructor() {
    const now = new Date();
    this.publication = new Publication();

    this.publication.title = '';
    this.publication.description = '';
    this.publication.pictureUid = '';
    this.publication.authorUid = '';
    this.publication.likes = 0;
    this.publication.createdAt = now;
    this.publication.updatedAt = now;
  }

  public static getInstance(): PublicationFactory {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): PublicationFactory {
    this.publication.uid = uid;
    return this;
  }

  setTitle(title: string): PublicationFactory {
    this.publication.title = title;
    return this;
  }

  setDescription(description: string): PublicationFactory {
    this.publication.description = description;
    return this;
  }

  setPictureUid(pictureUid: string): PublicationFactory {
    this.publication.pictureUid = pictureUid;
    return this;
  }

  setAuthorUid(authorUid: string): PublicationFactory {
    this.publication.authorUid = authorUid;
    return this;
  }

  setLikes(likes: number): PublicationFactory {
    this.publication.likes = likes;
    return this;
  }

  setCreatedAt(createdAt: Date): PublicationFactory {
    this.publication.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date): PublicationFactory {
    this.publication.updatedAt = updatedAt;
    return this;
  }

  build(): Publication {
    const publication = this.publication;

    this.publication = new Publication();
    return publication;
  }
}

const publicationFactory = PublicationFactory.getInstance();

export { publicationFactory };
