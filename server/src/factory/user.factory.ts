import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/entities/role';
import { AFactory } from './AFactory';

export class UserFactory extends AFactory<User> {
  private static _instance: UserFactory;

  reset(): UserFactory {
    this.object = new User();
    this.object.role = 'user';
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
}

const userFactory = UserFactory.getInstance();

export { userFactory };
