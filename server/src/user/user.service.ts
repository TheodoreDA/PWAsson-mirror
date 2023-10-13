import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userFactory } from 'src/factory/user.factory';

@Injectable()
export class UserService {
  private user1: User;
  private user2: User;
  private user3: User;

  constructor() {
    this.user1 = userFactory
      .setUid('1234567890')
      .setUsername('username1')
      .setHash('password1')
      .build();
    this.user2 = userFactory
      .setUid('0987654321')
      .setUsername('username2')
      .setHash('password2')
      .build();
    this.user3 = userFactory
      .setUid('6543210987')
      .setUsername('username3')
      .setHash('password3')
      .build();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return userFactory
      .setUid('AAAAAAAAAA')
      .setUsername(createUserDto.username)
      .setHash(createUserDto.password)
      .build();
  }

  async findAll(): Promise<User[]> {
    return [this.user1, this.user2, this.user3];
  }

  async findOne(userId: string): Promise<User> {
    return this.user1;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return userFactory
      .setUid('BBBBBBBBBB')
      .setUsername(updateUserDto.username)
      .setHash(updateUserDto.password)
      .build();
  }

  async remove(userId: string): Promise<void> {
    return;
  }
}
