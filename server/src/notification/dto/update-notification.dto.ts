import { PartialType } from '@nestjs/mapped-types';
import { AcceptNotificationDto } from './accept-notification.dto';

export class UpdateNotificationDto extends PartialType(AcceptNotificationDto) {}
