import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Message } from './entities/message.entity';

@ApiTags('Message')
@UseInterceptors(AccessTokenInterceptor)
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiCreatedResponse({
    description: 'The Message created',
    type: Message,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the chat',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can send Messages to their Chats',
  })
  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Body('payload') payload: Payload,
  ): Promise<Message> {
    return await this.messageService.create(payload.uid, createMessageDto);
  }

  @ApiQuery({
    name: 'pages',
    description: 'The offset that chunks the results in pages of 25.',
    type: Number,
    required: false,
  })
  @ApiOkResponse({
    type: Message,
    isArray: true,
  })
  @Get(':chatId')
  async getAll(
    @Param('chatId') chatId: string,
    @Query('pages') pages = 0,
    @Body('payload') payload: Payload,
  ): Promise<Message[]> {
    return await this.messageService.findAll(payload.uid, chatId, pages);
  }

  @ApiOkResponse({
    type: Message,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Message',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can retreive their Messages',
  })
  @Get('one/:messageId')
  async findOne(
    @Param('messageId') messageId: string,
    @Body('payload') payload: Payload,
  ): Promise<Message> {
    return await this.messageService.findOne(payload.uid, messageId);
  }

  @ApiOkResponse({
    description: 'Message deleted',
  })
  @ApiNotFoundResponse({
    description: "Could not find the Message, or the Chat's message",
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can delete their Messages',
  })
  @Delete(':messageId')
  async remove(
    @Param('messageId') messageId: string,
    @Body('payload') payload: Payload,
  ): Promise<void> {
    return await this.messageService.remove(payload.uid, messageId);
  }
}
