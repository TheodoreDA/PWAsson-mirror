import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [JwtModule, NotificationModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
