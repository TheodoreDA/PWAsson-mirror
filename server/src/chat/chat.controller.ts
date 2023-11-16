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

@UseInterceptors(AccessTokenInterceptor)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(
    @Body() createChatDto: CreateChatDto,
    @Body('payload') payload: Payload,
  ) {
    return await this.chatService.create(payload.uid, createChatDto);
  }

  @Get()
  async getAllConversations(@Body('payload') payload: Payload) {
    return await this.chatService.findAll(payload.uid);
  }

  @Get(':chatId')
  async findOne(
    @Param('chatId') chatId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.chatService.findOne(payload.uid, chatId);
  }

  @Delete(':chatId')
  async remove(
    @Param('chatId') chatId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.chatService.remove(payload.uid, chatId);
  }
}
