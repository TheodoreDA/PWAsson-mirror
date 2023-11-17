import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('promote')
  async promote(@Body() userId: string): Promise<void> {
    return await this.adminService.promote(userId);
  }

  @Post('demote')
  async demote(@Body() userId: string): Promise<void> {
    return await this.adminService.demote(userId);
  }
}
