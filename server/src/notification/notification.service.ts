import { Injectable } from '@nestjs/common';
import { AcceptNotificationDto } from './dto/accept-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import webpush from 'web-push';

@Injectable()
export class NotificationService {
  acceptNotification(acceptNotificationDto: AcceptNotificationDto) {
    webpush.setVapidDetails(
      'mailto:' + process.env.EMAIL,
      process.env.PUBLIC_VAPID_KEY,
      process.env.PRIVATE_VAPID_KEY,
    );
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
}
