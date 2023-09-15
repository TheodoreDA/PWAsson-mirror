import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    return new User();
  }

  async findAll(): Promise<User[]> {
    return [new User()];
  }

  async findOne(userId: string): Promise<User> {
    return new User();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return new User();
  }

  async remove(userId: string): Promise<void> {
    return;
  }
}
