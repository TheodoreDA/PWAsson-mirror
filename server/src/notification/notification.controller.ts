import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AcceptNotificationDto } from './dto/accept-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

}
