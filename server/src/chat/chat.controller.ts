import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Chat } from './entities/chat.entity';

@ApiTags('Chat')
@ApiBearerAuth()
@UseInterceptors(AccessTokenInterceptor)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiCreatedResponse({
    description: 'The created Chat',
    type: Chat,
  })
  @ApiNotFoundResponse({
    description: 'Could not find user (from body)',
  })
  @ApiBadRequestResponse({
    description: 'Cannot create chat with only the connected user',
  })
  @Post()
  async create(
    @Body() createChatDto: CreateChatDto,
    @Body('payload') payload: Payload,
  ): Promise<Chat> {
    return await this.chatService.create(payload.uid, createChatDto);
  }

  @ApiOkResponse({
    description: 'A list of all the chats of the connected user',
    type: Chat,
    isArray: true,
  })
  @Get()
  async getAll(@Body('payload') payload: Payload): Promise<Chat[]> {
    return await this.chatService.findAll(payload.uid);
  }

  @ApiOkResponse({
    type: Chat,
  })
  @ApiNotFoundResponse({
    description: 'Cound not find chatId',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can retreive their Chats',
  })
  @Get(':chatId')
  async findOne(
    @Param('chatId') chatId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.chatService.findOne(payload.uid, chatId);
  }

  @ApiOkResponse({
    type: Chat,
  })
  @ApiNotFoundResponse({
    description: 'Cound not find chatId',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can leave their Chats',
  })
  @Delete(':chatId')
  async remove(
    @Param('chatId') chatId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.chatService.remove(payload.uid, chatId);
  }
}
