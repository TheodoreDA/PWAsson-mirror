import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return await this.userService.remove(userId);
  }
}
