import { User } from 'src/user/entities/user.entity';
import { IFactory } from './IFactory';

export class UserFactory implements IFactory<User> {
  private static _instance: UserFactory;
  private user: User;

  private constructor() {
    this.user = new User();
  }

  public static getInstance(): UserFactory {
    return this._instance || (this._instance = new this());
  }

  setUid(uid: string): UserFactory {
    this.user.uid = uid;
    return this;
  }

  setUsername(username: string): UserFactory {
    this.user.username = username;
    return this;
  }

  setHash(hash: string): UserFactory {
    this.user.hash = hash;
    return this;
  }

  build(): User {
    const user = this.user;

    this.user = new User();
    return user;
  }
}

const userFactory = UserFactory.getInstance();

export { userFactory };
