import { Injectable } from '@nestjs/common';
import { AcceptNotificationDto } from './dto/accept-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import webpush from 'web-push';

@Injectable()
export class NotificationService {
}
