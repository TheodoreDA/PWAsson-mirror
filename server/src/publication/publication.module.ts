import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { JwtModule } from '@nestjs/jwt';
import { SocketModule } from 'src/gateway/socket.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [JwtModule, NotificationModule, SocketModule],
  controllers: [PublicationController],
  providers: [PublicationService],
})
export class PublicationModule {}
