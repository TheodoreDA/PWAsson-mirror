import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PublicationModule } from './publication/publication.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PublicationModule,
    CommentModule,
    ChatModule,
    AdminModule,
  ],
})
export class AppModule {}
