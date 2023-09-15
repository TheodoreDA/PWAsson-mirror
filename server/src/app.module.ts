import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PublicationModule } from './publication/publication.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    PublicationModule,
    CommentModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
