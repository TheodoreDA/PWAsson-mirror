import { User } from 'src/user/entities/user.entity';
import { IFactory } from './IFactory';
import { Role } from 'src/user/entities/role';

export class UserFactory implements IFactory<User> {
  private static _instance: UserFactory;
  private user: User;

  private constructor() {
    this.user = new User();
    this.user.role = 'user';
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

  setRole(role: Role): UserFactory {
    this.user.role = role;
    return this;
  }

  build(): User {
    const user = this.user;

    this.user = new User();
    this.user.role = 'user';
    return user;
  }
}

const userFactory = UserFactory.getInstance();

export { userFactory };
