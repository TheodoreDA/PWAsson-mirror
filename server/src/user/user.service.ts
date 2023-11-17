import { User } from './entities/user.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userBuilder } from 'src/builder/user.builder';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DB_ID, db } from 'src/database/app.database';
import { Models, Query } from 'node-appwrite';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    let docs: Models.DocumentList<Models.Document>;
    let doc: Models.Document;

    try {
      docs = await db.listDocuments(DB_ID, 'USERS', [
        Query.equal('username', createUserDto.username),
      ]);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }
    if (docs.total != 0) {
      throw new BadRequestException(
        "Username '" + createUserDto.username + "' is already used",
      );
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = userBuilder
      .setUid(uuidv4())
      .setUsername(createUserDto.username)
      .setHash(createUserDto.password)
      .build();

    try {
      doc = await db.createDocument(DB_ID, 'USERS', user.uid, user);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }
    return userBuilder.buildFromDoc(doc);
  }

  async findAll(): Promise<User[]> {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(DB_ID, 'USERS');
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return userBuilder.buildFromDocs(docs);
  }

  async findOne(userId: string): Promise<User> {
    console.log(userId);
    let doc: Models.Document;
    
    try {
      doc = await db.getDocument(DB_ID, 'USERS', userId);
      console.log("test");

    } catch (e) {
      console.log("crash");
      throw new NotFoundException(e.message);
    }

    console.log("success");
    return userBuilder.buildFromDoc(doc);
  }

  async findByUsername(username: string): Promise<User> {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(DB_ID, 'USERS', [
        Query.equal('username', username),
      ]);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    if (docs.total == 0) {
      throw new NotFoundException(
        "Could not find user with username '" + username + "'",
      );
    }
    if (docs.total > 1) {
      throw new ConflictException(
        "Multiple users with username '" + username + "'",
      );
    }

    return userBuilder.buildFromDoc(docs.documents[0]);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    let doc: Models.Document;
    const user = await this.findOne(userId);

    user.username = updateUserDto.username;
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    user.hash = updateUserDto.password;

    try {
      doc = await db.updateDocument(DB_ID, 'USERS', userId, user);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return userBuilder.buildFromDoc(doc);
  }

  async remove(userId: string): Promise<void> {
    try {
      await db.deleteDocument(DB_ID, 'USERS', userId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  async getAllUserNotificationAllowed(): Promise<User[]> {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(DB_ID, 'USERS', [
        Query.equal('isNotifAllowed', true),
      ]);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return userBuilder.buildFromDocs(docs);
  }

  async isNotifAllowed(userId: string): Promise<boolean> {
    const user = await this.findOne(userId);
    return user.isNotifAllowed;
  }
}
