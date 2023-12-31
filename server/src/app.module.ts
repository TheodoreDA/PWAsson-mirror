import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PublicationModule } from './publication/publication.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { MessageModule } from './message/message.module';
import { SocketModule } from './gateway/socket.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // registerAsync fixes the ConfigurationModule not loading the .env file in time
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    AuthModule,
    UserModule,
    PublicationModule,
    CommentModule,
    ChatModule,
    MessageModule,
    AdminModule,
    SocketModule,
    NotificationModule,
  ],
})
export class AppModule {}
