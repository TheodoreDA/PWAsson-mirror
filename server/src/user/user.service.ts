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

  async findOne(id: number): Promise<User> {
    return new User();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return new User();
  }

  async remove(id: number): Promise<void> {
    return;
  }
}
