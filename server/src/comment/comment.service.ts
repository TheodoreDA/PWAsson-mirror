import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { commentFactory } from 'src/factory/comment.factory';
import { v4 as uuidv4 } from 'uuid';
import { DB_ID, db } from 'src/database/app.database';
import { Models, Query } from 'node-appwrite';

@Injectable()
export class CommentService {
  async create(createCommentDto: CreateCommentDto, authorUid: string) {
    let doc: Models.Document;

    // check if publication exists
    try {
      await db.getDocument(
        DB_ID,
        'PUBLICATIONS',
        createCommentDto.publicationUid,
      );
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    // build local object
    const comment = commentFactory
      .setUid(uuidv4())
      .setPublicationUid(createCommentDto.publicationUid)
      .setContent(createCommentDto.content)
      .setAuthorUid(authorUid)
      .setCreatedAt(new Date())
      .build();

    // save it in database
    try {
      doc = await db.createDocument(DB_ID, 'COMMENTS', comment.uid, comment);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return commentFactory.buildFromDoc(doc);
  }

  async findAll(publicationId: string) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(DB_ID, 'COMMENTS', [
        Query.equal('publicationUid', publicationId),
      ]);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return commentFactory.buildFromDocs(docs);
  }

  async findOne(commentId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument(DB_ID, 'COMMENTS', commentId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return commentFactory.buildFromDoc(doc);
  }

  async update(
    commentId: string,
    connectedUserUid: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    let doc: Models.Document;
    const comment = await this.findOne(commentId);

    if (comment.authorUid != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its comments');

    comment.content = updateCommentDto.content;
    comment.createdAt = new Date();

    try {
      doc = await db.updateDocument(DB_ID, 'COMMENTS', commentId, comment);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return commentFactory.buildFromDoc(doc);
  }

  async remove(commentId: string, connectedUserUid: string) {
    const comment = await this.findOne(commentId);

    if (comment.authorUid != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its comments');

    try {
      await db.deleteDocument(DB_ID, 'COMMENTS', commentId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
