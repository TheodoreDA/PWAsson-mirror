import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/entities/role';
import { ABuilder } from './ABuilder';
import { Models } from 'node-appwrite';

export class UserBuilder extends ABuilder<User> {
  private static _instance: UserBuilder;

  reset(): UserBuilder {
    this.object = new User();
    this.object.role = 'user';
    this.object.publicationsUid = [];
    this.object.publicationsLikedUid = [];
    this.object.commentsLikedUid = [];
    this.object.isNotifAllowed = false;
    this.object.endpoint = null;
    this.object.expirationTime = null;
    this.object.p256dh = null;
    this.object.auth = null;
    return this;
  }

  public static getInstance(): UserBuilder {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): UserBuilder {
    this.object.uid = uid;
    return this;
  }

  setUsername(username: string): UserBuilder {
    this.object.username = username;
    return this;
  }

  setHash(hash: string): UserBuilder {
    this.object.hash = hash;
    return this;
  }

  setRole(role: Role): UserBuilder {
    this.object.role = role;
    return this;
  }

  setPublicationsUid(publicationsUid: string[]): UserBuilder {
    this.object.publicationsUid = publicationsUid;
    return this;
  }

  setPublicationsLikedUid(publicationsLikedUid: string[]): UserBuilder {
    this.object.publicationsLikedUid = publicationsLikedUid;
    return this;
  }

  setCommentsLikedUid(commentsLikedUid: string[]): UserBuilder {
    this.object.commentsLikedUid = commentsLikedUid;
    return this;
  }

  setIsNotifAllowed(isNotifAllowed: boolean): UserBuilder {
    this.object.isNotifAllowed = isNotifAllowed;
    return this;
  }

  setEndpoint(endpoint: string): UserBuilder {
    this.object.endpoint = endpoint;
    return this;
  }

  setExpirationTime(expirationTime: number | null): UserBuilder {
    this.object.expirationTime = expirationTime;
    return this;
  }

  setP256dh(p256dh: string): UserBuilder {
    this.object.p256dh = p256dh;
    return this;
  }

  setAuth(auth: string): UserBuilder {
    this.object.auth = auth;
    return this;
  }

  buildFromDoc(doc: Models.Document): User {
    this.setUid(doc['uid']);
    this.setUsername(doc['username']);
    this.setHash(doc['hash']);
    this.setRole(doc['role']);
    this.setPublicationsUid(doc['publicationsUid']);
    this.setPublicationsLikedUid(doc['publicationsLikedUid']);
    this.setCommentsLikedUid(doc['commentsLikedUid']);
    this.setIsNotifAllowed(doc['isNotifAllowed']);
    this.setEndpoint(doc['endpoint']);
    this.setExpirationTime(doc['expirationTime']);
    this.setP256dh(doc['p256dh']);
    this.setAuth(doc['auth']);
    return this.build();
  }
}

const userBuilder = UserBuilder.getInstance();

export { userBuilder };
