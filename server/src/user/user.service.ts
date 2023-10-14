import { User } from './entities/user.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userFactory } from 'src/factory/user.factory';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'src/database/app.database';
import { Models, Query } from 'node-appwrite';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = userFactory
      .setUid(uuidv4())
      .setUsername(createUserDto.username)
      .setHash(createUserDto.password)
      .build();

    try {
      await db.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_USER_ID,
        user.uid,
        user,
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_USER_ID,
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
    }

    const users: User[] = [];

    docs.documents.forEach((doc: Models.Document) =>
      users.push(
        userFactory
          .setUid(doc['uid'])
          .setUsername(doc['username'])
          .setHash(doc['hash'])
          .setRole(doc['role'])
          .build(),
      ),
    );
    return users;
  }

  async findOne(userId: string): Promise<User> {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_USER_ID,
        [Query.equal('uid', userId)],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
    }

    if (docs.total == 0) {
      throw new NotFoundException(
        "Could not find user with uid '" + userId + "'",
      );
    }
    if (docs.total > 1)
      throw new ConflictException("Multiple users with uid '" + userId + "'");

    return userFactory
      .setUid(docs.documents[0]['uid'])
      .setUsername(docs.documents[0]['username'])
      .setHash(docs.documents[0]['hash'])
      .setRole(docs.documents[0]['role'])
      .build();
  }

  async findByUsername(username: string): Promise<User> {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_USER_ID,
        [Query.equal('username', username)],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
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

    return userFactory
      .setUid(docs.documents[0]['uid'])
      .setUsername(docs.documents[0]['username'])
      .setHash(docs.documents[0]['hash'])
      .setRole(docs.documents[0]['role'])
      .build();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    let doc: Models.Document;
    const user = await this.findOne(userId);

    user.username = updateUserDto.username;
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    user.hash = updateUserDto.password;

    try {
      doc = await db.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_USER_ID,
        userId,
        user,
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
    }

    return userFactory
      .setUid(doc['uid'])
      .setUsername(doc['username'])
      .setHash(doc['hash'])
      .setRole(doc['role'])
      .build();
  }

  async remove(userId: string): Promise<void> {
    try {
      await db.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_COLLECTION_USER_ID,
        userId,
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message);
    }
  }
}
