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
import { Payload } from 'src/auth/dto/payload';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseInterceptors(AccessTokenInterceptor)
  @Post("acceptNotification")
  acceptNotification(@Body() notificationInfo: AcceptNotificationDto, @Body('payload') payload: Payload) {
    console.log("acceptNotification", notificationInfo);
    return this.notificationService.acceptNotification(notificationInfo, payload.uid);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Post("revokeNotification")
  revokeNotification(@Body('payload') payload: Payload) {
    return this.notificationService.revokeNotification(payload.uid);
  }
}
