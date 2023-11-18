import { BadRequestException, Injectable } from '@nestjs/common';
import { AcceptNotificationDto } from './dto/accept-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserService } from 'src/user/user.service';
import { DB_ID, db } from 'src/database/app.database';
import { Publication } from 'src/publication/entities/publication.entity';
import { User } from 'src/user/entities/user.entity';
import { commentBuilder } from 'src/builder/comment.builder';

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
      ).then((result) => {
        console.log("result: ", result)
      }).catch((err) => {
        console.log("error: ", err)
      });
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
          body: 'this is an Example',
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
            url: 'http://localhost:3000/feed',
          }
        });
      }
    })
  }

  async isUserNotifAllowed(uid: string) {
    const user = await this.userService.findOne(uid);

    return user.isNotifAllowed;
  }

  async notifyUserOfPublicationLike(user: User, authorUid: string, status: string, publicationUid: string) {
    const author = await this.userService.findOne(authorUid);

    if (user.uid === authorUid) {
      return;
    }
    if (!author.isNotifAllowed) {
      return;
    }

    if (status === 'like') {
      this.sendNotification(author, {
        notification: {
          title: "New like from " + user.username,
          body: "Go check it out!",
          url: 'http://localhost:3000/post?id=' + publicationUid,
        }
      });
    } else {
      this.sendNotification(author, {
        notification: {
          title: "New dislike from " + user.username,
          body: "Go check it out!",
          url: 'http://localhost:3000/post?id=' + publicationUid,
        }
      });
    }
  }

  async notifyUserOfCommentLike(user: User, authorUid: string, status: string, commentMessage: string, publicationUid: string) {
    const author = await this.userService.findOne(authorUid);

    if (user.uid === authorUid) {
      return;
    }
    if (!author.isNotifAllowed) {
      return;
    }
    if (status === 'like') {
      this.sendNotification(author, {
        notification: {
          title: `New like on your comment ${commentMessage}`,
          body: `like from ${user.username}! Go check it out!`,
          url: 'http://localhost:3000/post?id=' + publicationUid,
        }
      });
    } else {
      this.sendNotification(author, {
        notification: {
          title: `New dislike on your comment ${commentMessage}`,
          body: `dislike from ${user.username}! Go check it out!`,
          url: 'http://localhost:3000/post?id=' + publicationUid,
        }
      });
    }
  }

  async notifyUserOfComment(commentAuthorUid: string, publicationId: string, commentMessage: string) {
    const commentAuthor = await this.userService.findOne(commentAuthorUid);
    const doc = await db.getDocument(DB_ID, 'PUBLICATIONS', publicationId);
    const publication = commentBuilder.buildFromDoc(doc);
    const publicationAuthor = await this.userService.findOne(publication.authorUid);

    if (commentAuthorUid === publicationAuthor.uid) {
      return;
    }
    console.log("before if 2")
    if (!publicationAuthor.isNotifAllowed) {
      return;
    }
    this.sendNotification(publicationAuthor, {
      notification: {
        title: `New comment on your post from ${commentAuthor.username}`,
        body: `Message: ${commentMessage}`,
        url: 'http://localhost:3000/post?id=' + publicationId,
      }
    });
  }
}
