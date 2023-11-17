import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { commentBuilder } from 'src/builder/comment.builder';
import { v4 as uuidv4 } from 'uuid';
import { DB_ID, db } from 'src/database/app.database';
import { Models, Query } from 'node-appwrite';
import { userBuilder } from 'src/builder/user.builder';

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
    const comment = commentBuilder
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
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return commentBuilder.buildFromDoc(doc);
  }

  async findAll(publicationId: string, pages: number) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(DB_ID, 'COMMENTS', [
        Query.equal('publicationUid', publicationId),
        Query.offset(pages),
      ]);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return commentBuilder.buildFromDocs(docs);
  }

  async findOne(commentId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument(DB_ID, 'COMMENTS', commentId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    return commentBuilder.buildFromDoc(doc);
  }

  async likeUnlike(connectedUserUid: string, commentId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument(DB_ID, 'USERS', connectedUserUid);
    } catch (e) {
      if (e.message == 'Document with the requested ID could not be found.')
        throw new NotFoundException('Could not find the connected user.');
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    const user = userBuilder.buildFromDoc(doc);

    try {
      doc = await db.getDocument(DB_ID, 'COMMENTS', commentId);
    } catch (e) {
      if (e.message == 'Document with the requested ID could not be found.')
        throw new NotFoundException('Could not find the comment.');
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    const comment = commentBuilder.buildFromDoc(doc);

    if (
      user.commentsLikedUid.includes(commentId) ||
      comment.likesUid.includes(connectedUserUid)
    ) {
      // Remove comment from user's likes
      if (user.commentsLikedUid.indexOf(commentId) != -1) {
        user.commentsLikedUid = user.commentsLikedUid.filter(
          (uid) => uid != commentId,
        );
      }
      // Remove user from comment's likes
      if (comment.likesUid.indexOf(connectedUserUid) != -1) {
        comment.likesUid = comment.likesUid.filter(
          (uid) => uid != connectedUserUid,
        );
      }
    } else {
      user.commentsLikedUid.push(commentId);
      comment.likesUid.push(connectedUserUid);
    }

    try {
      doc = await db.updateDocument(DB_ID, 'USERS', connectedUserUid, user);
      doc = await db.updateDocument(DB_ID, 'COMMENTS', commentId, comment);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
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
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return commentBuilder.buildFromDoc(doc);
  }

  async remove(commentId: string, connectedUserUid: string) {
    const comment = await this.findOne(commentId);

    if (comment.authorUid != connectedUserUid)
      throw new UnauthorizedException('Only owners can update their comments');

    try {
      await db.deleteDocument(DB_ID, 'COMMENTS', commentId);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }
  }
}
