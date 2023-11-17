import { BadRequestException, Injectable } from '@nestjs/common';
import { AcceptNotificationDto } from './dto/accept-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserService } from 'src/user/user.service';
import { DB_ID, db } from 'src/database/app.database';
import { Publication } from 'src/publication/entities/publication.entity';
import { User } from 'src/user/entities/user.entity';

const webpush = require('web-push');

@Injectable()
export class NotificationService {
  private readonly userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  sendNotification(user: User, payload: object) {
    try {
      webpush.setVapidDetails(
        process.env.EMAIL,
        process.env.PUBLIC_VAPID_KEY,
        process.env.PRIVATE_VAPID_KEY,
      );
    } catch (e) {
      console.log("couldn't set vapid details");
    }

    try {
      webpush.sendNotification(
        {
          endpoint: user.endpoint,
          expirationTime: user.expirationTime,
          keys: {
            p256dh: user.p256dh,
            auth: user.auth,
          },
        },
        JSON.stringify(payload),
      );
    } catch (e) {
      console.log('Could not send notification to: ', user.username);
    }
  }

  async acceptNotification(acceptNotificationDto: AcceptNotificationDto, uid: string) {
    const user = await this.userService.findOne(uid);

    user.isNotifAllowed = true;
    user.endpoint = acceptNotificationDto.endpoint;
    user.expirationTime = acceptNotificationDto.expirationTime;
    user.p256dh = acceptNotificationDto.keys.p256dh;
    user.auth = acceptNotificationDto.keys.auth;
    
    try {
      await db.updateDocument(DB_ID, 'USERS', uid, user);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    const payload = {
      notification: {
          title: 'Well done you subscribed to notification',
          body: 'this is a test notification',
      },
    };

    this.sendNotification(user, payload);

    return 'This action adds a new Notification';
  }

  async revokeNotification(uid: string) {
    const user = await this.userService.findOne(uid);

    user.isNotifAllowed = false;
    user.endpoint = null;
    user.expirationTime = null;
    user.p256dh = null;
    user.auth = null;
    
    try {
      await db.updateDocument(DB_ID, 'USERS', uid, user);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }
  }

  async notifAllUsers(publication: Publication) {
    const users = await this.userService.getAllUserNotificationAllowed()

    users.forEach(user => {
      if (user.uid !== publication.authorUid) {
        this.sendNotification(user, {
          notification: {
            title: "New publication:" + publication.title,
            body: publication.description,
          }
        });
      }
    })
      
  }
}
