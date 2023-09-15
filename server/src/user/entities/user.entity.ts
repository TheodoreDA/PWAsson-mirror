import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  username: string;

  @Column()
  hash: string;

  @Column()
  role: Role;
}
