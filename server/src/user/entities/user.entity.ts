import { Role } from './role';

export class User {
  uid: string;
  username: string;
  hash: string;
  role: Role;
  publicationsLiked: string[];
}
