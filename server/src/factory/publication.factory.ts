import { Publication } from 'src/publication/entities/publication.entity';
import { AFactory } from './AFactory';

export class PublicationFactory extends AFactory<Publication> {
  private static _instance: PublicationFactory;

  reset(): PublicationFactory {
    const now = new Date();

    this.object = new Publication();
    this.object.title = '';
    this.object.description = '';
    this.object.pictureUid = '';
    this.object.authorUid = '';
    this.object.likes = 0;
    this.object.createdAt = now;
    this.object.updatedAt = now;
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

  setPictureUid(pictureUid: string): PublicationFactory {
    this.object.pictureUid = pictureUid;
    return this;
  }

  setAuthorUid(authorUid: string): PublicationFactory {
    this.object.authorUid = authorUid;
    return this;
  }

  setLikes(likes: number): PublicationFactory {
    this.object.likes = likes;
    return this;
  }

  setCreatedAt(createdAt: Date): PublicationFactory {
    this.object.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date): PublicationFactory {
    this.object.updatedAt = updatedAt;
    return this;
  }
}

const publicationFactory = PublicationFactory.getInstance();

export { publicationFactory };
