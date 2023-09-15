import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Body('payload') payload: Payload,
  ) {
    if (userId != payload.uid) {
      throw new UnauthorizedException('Only owner can update its data');
    }
    return await this.userService.update(userId, updateUserDto);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Delete(':userId')
  async remove(
    @Param('userId') userId: string,
    @Body('payload') payload: Payload,
  ) {
    if (userId != payload.uid) {
      throw new UnauthorizedException('Only owner can delete its data');
    }
    return await this.userService.remove(userId);
  }
}
