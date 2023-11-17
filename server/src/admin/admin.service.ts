import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async promote(userId: string): Promise<void> {
    return;
  }

  async demote(userId: string): Promise<void> {
    return;
  }
}
