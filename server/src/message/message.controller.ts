import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';

@UseInterceptors(AccessTokenInterceptor)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Body('payload') payload: Payload,
  ) {
    return await this.messageService.create(payload.uid, createMessageDto);
  }

  @Get(':chatId')
  async getAll(
    @Param('chatId') chatId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.messageService.findAll(payload.uid, chatId);
  }

  @Get('one/:messageId')
  async findOne(
    @Param('messageId') messageId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.messageService.findOne(payload.uid, messageId);
  }

  @Delete(':messageId')
  async remove(
    @Param('messageId') messageId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.messageService.remove(payload.uid, messageId);
  }
}
