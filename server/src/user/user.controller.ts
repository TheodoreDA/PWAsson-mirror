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
import { Payload } from 'src/auth/dto/payload';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({
    description: 'The User created',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Username already used',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @Get('/isNotifAllowed/')
  async isNotifAllowed(@Body('payload') payload: Payload): Promise<boolean> {
    return await this.userService.isNotifAllowed(payload.uid);
  }

  @ApiOkResponse({
    type: User,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @ApiOkResponse({
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the User',
  })
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.userService.findOne(userId);
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiOkResponse({
    description: 'The User modified',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the User',
  })
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Body('payload') payload: Payload,
  ): Promise<User> {
    return await this.userService.update(payload.uid, updateUserDto);
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiOkResponse({
    description: 'User deleted',
  })
  @ApiNotFoundResponse({
    description: 'Could not find the User',
  })
  @Delete()
  async remove(@Body('payload') payload: Payload): Promise<void> {
    return await this.userService.remove(payload.uid);
  }
}
