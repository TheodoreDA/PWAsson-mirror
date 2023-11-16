import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/entities/role';
import { AFactory } from './AFactory';
import { Models } from 'node-appwrite';

export class UserFactory extends AFactory<User> {
  private static _instance: UserFactory;

  reset(): UserFactory {
    this.object = new User();
    this.object.role = 'user';
    this.object.publicationsUid = [];
    this.object.publicationsLikedUid = [];
    return this;
  }

  public static getInstance(): UserFactory {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): UserFactory {
    this.object.uid = uid;
    return this;
  }

  setUsername(username: string): UserFactory {
    this.object.username = username;
    return this;
  }

  setHash(hash: string): UserFactory {
    this.object.hash = hash;
    return this;
  }

  setRole(role: Role): UserFactory {
    this.object.role = role;
    return this;
  }

  setPublicationsUid(publicationsUid: string[]): UserFactory {
    this.object.publicationsUid = publicationsUid;
    return this;
  }

  setPublicationsLikedUid(publicationsLikedUid: string[]): UserFactory {
    this.object.publicationsLikedUid = publicationsLikedUid;
    return this;
  }

  buildFromDoc(doc: Models.Document): User {
    this.setUid(doc['uid']);
    this.setUsername(doc['username']);
    this.setHash(doc['hash']);
    this.setRole(doc['role']);
    this.setPublicationsUid(doc['publicationsUid']);
    this.setPublicationsLikedUid(doc['publicationsLikedUid']);
    return this.build();
  }
}

const userFactory = UserFactory.getInstance();

export { userFactory };
