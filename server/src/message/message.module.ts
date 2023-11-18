import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [JwtModule, NotificationModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
