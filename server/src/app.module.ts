import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PublicationModule } from './publication/publication.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    UserModule,
    PublicationModule,
    CommentModule,
    ChatModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
