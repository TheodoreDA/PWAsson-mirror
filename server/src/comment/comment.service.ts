import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { commentFactory } from 'src/factory/comment.factory';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'src/database/app.database';
import { Models, Query } from 'node-appwrite';

@Injectable()
export class CommentService {
  async create(createCommentDto: CreateCommentDto, authorUid: string) {
    let doc: Models.Document;

    // check if publication exists
    try {
      await db.getDocument(
        'DEV',
        'PUBLICATIONS',
        createCommentDto.publicationUid,
      );
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    // build local object
    const comment = commentFactory
      .setUid(uuidv4())
      .setContent(createCommentDto.content)
      .setLikes(0)
      .setCreatedAt(new Date())
      .build();

    // save it in database
    try {
      doc = await db.createDocument('DEV', 'COMMENTS', comment.uid, {
        ...comment.toObject(),
        publication: createCommentDto.publicationUid,
        author: authorUid,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return commentFactory.buildfromDoc(doc);
  }

  async findAll(publicationId: string) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments('DEV', 'COMMENTS', [
        Query.equal('publication', publicationId),
      ]);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const comments: Comment[] = [];

    docs.documents.forEach((doc: Models.Document) =>
      comments.push(commentFactory.buildfromDoc(doc)),
    );
    return comments;
  }

  async findOne(commentId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument('DEV', 'COMMENTS', commentId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return commentFactory.buildfromDoc(doc);
  }

  async update(
    commentId: string,
    connectedUserUid: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    let doc: Models.Document;
    const comment = await this.findOne(commentId);

    if (comment.author.toString() != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its comments');
    comment.content = updateCommentDto.content;
    comment.createdAt = new Date();

    try {
      doc = await db.updateDocument('DEV', 'COMMENTS', commentId, comment);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return commentFactory.buildfromDoc(doc);
  }

  async remove(commentId: string, connectedUserUid: string) {
    const comment = await this.findOne(commentId);

    if (comment.author.toString() != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its comments');

    try {
      await db.deleteDocument('DEV', 'COMMENTS', commentId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
