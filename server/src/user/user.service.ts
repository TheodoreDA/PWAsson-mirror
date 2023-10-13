import { User } from './entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userFactory } from 'src/factory/user.factory';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];

  constructor() {
    this.users.push(
      userFactory
        .setUid('1234567890')
        .setUsername('username1')
        .setHash(bcrypt.hashSync('password1', 10))
        .build(),
    );
    this.users.push(
      userFactory
        .setUid('0987654321')
        .setUsername('username2')
        .setHash(bcrypt.hashSync('password2', 10))
        .build(),
    );
    this.users.push(
      userFactory
        .setUid('6543210987')
        .setUsername('username3')
        .setHash(bcrypt.hashSync('password3', 10))
        .build(),
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = userFactory
      .setUid(await bcrypt.genSalt(10))
      .setUsername(createUserDto.username)
      .setHash(createUserDto.password)
      .build();
    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(userId: string): Promise<User> {
    const user = this.users.find((user) => user.uid == userId);

    if (user == undefined)
      throw new NotFoundException(
        "Could not find user with id '" + userId + "'",
      );
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = this.users.find((user) => user.username == username);

    if (user == undefined)
      throw new NotFoundException(
        "Could not find user with username '" + username + "'",
      );
    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userIdx = this.users.findIndex((user) => user.uid == userId);

    if (userIdx == -1)
      throw new NotFoundException("Could not find user '" + userId + "'");
    if (updateUserDto.username)
      this.users[userIdx].username = updateUserDto.username;
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      this.users[userIdx].username = updateUserDto.username;
    }
    return this.users[userIdx];
  }

  async remove(userId: string): Promise<void> {
    const userIdx = this.users.findIndex((user) => user.uid == userId);

    if (userIdx == -1)
      throw new NotFoundException("Could not find user '" + userId + "'");
    delete this.users[userIdx];
  }
}
