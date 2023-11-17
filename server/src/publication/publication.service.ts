import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { publicationBuilder } from 'src/builder/publication.builder';
import { v4 as uuidv4 } from 'uuid';
import { DB_ID, db, storage } from 'src/database/app.database';
import { InputFile, Models } from 'node-appwrite';
import { userBuilder } from 'src/builder/user.builder';
import { Query } from 'appwrite';
import { SocketService } from 'src/gateway/socket.service';

@Injectable()
export class PublicationService {
  constructor(private readonly socketService: SocketService) {}

  async create(
    createPublicationDto: CreatePublicationDto,
    picture: Express.Multer.File,
    connectedUserUid: string,
  ) {
    let doc: Models.Document;
    const pictureUid = uuidv4();

    try {
      await storage.createFile(
        DB_ID,
        pictureUid,
        InputFile.fromPath(picture.path, picture.originalname),
      );
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }
    const publication = publicationBuilder
      .setUid(uuidv4())
      .setTitle(createPublicationDto.title)
      .setDescription(createPublicationDto.description)
      .setAuthorUid(connectedUserUid)
      .setPictureUid(pictureUid)
      .build();

    try {
      doc = await db.createDocument(
        DB_ID,
        'PUBLICATIONS',
        publication.uid,
        publication,
      );
    } catch (e) {
      try {
        await storage.deleteFile(DB_ID, pictureUid);
      } catch (e) {
        throw new BadRequestException('UnknownException: ' + e.message);
      }
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    this.socketService.emitNewPublication(publication);
    return publicationBuilder.buildFromDoc(doc);
  }

  async findAll(pages: number) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(DB_ID, 'PUBLICATIONS', [
        Query.offset(pages),
      ]);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return publicationBuilder.buildFromDocs(docs);
  }

  async findOne(publicationId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument(DB_ID, 'PUBLICATIONS', publicationId);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return publicationBuilder.buildFromDoc(doc);
  }

  async getPicture(pictureId: string) {
    try {
      return storage.getFileView(DB_ID, pictureId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  async likeUnlike(connectedUserUid: string, publicationId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument(DB_ID, 'USERS', connectedUserUid);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const user = userBuilder.buildFromDoc(doc);

    try {
      doc = await db.getDocument(DB_ID, 'PUBLICATIONS', publicationId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }

    const publication = publicationBuilder.buildFromDoc(doc);

    if (user.publicationsLikedUid.includes(publicationId)) {
      // Remove publication from user's likes
      if (user.publicationsLikedUid.indexOf(publicationId) != -1) {
        user.publicationsLikedUid = user.publicationsLikedUid.filter(
          (uid) => uid != publicationId,
        );
      }
      // Remove user from publication's likes
      if (publication.likesUid.indexOf(connectedUserUid) != -1) {
        publication.likesUid = publication.likesUid.filter(
          (uid) => uid != connectedUserUid,
        );
      }
    } else {
      user.publicationsLikedUid.push(publicationId);
      publication.likesUid.push(connectedUserUid);
    }

    try {
      doc = await db.updateDocument(DB_ID, 'USERS', connectedUserUid, user);
      doc = await db.updateDocument(
        DB_ID,
        'PUBLICATIONS',
        publicationId,
        publication,
      );
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }
  }

  async update(
    publicationId: string,
    picture: Express.Multer.File,
    connectedUserUid: string,
    updatePublicationDto: UpdatePublicationDto,
  ) {
    let doc: Models.Document;
    const publication = await this.findOne(publicationId);

    if (publication.authorUid != connectedUserUid) {
      throw new UnauthorizedException(
        'Only owners can update their publications',
      );
    }

    if (picture != undefined || picture != null) {
      const pictureUid = uuidv4();

      try {
        await storage.createFile(
          DB_ID,
          pictureUid,
          InputFile.fromPath(picture.path, picture.originalname),
        );
        await storage.deleteFile(DB_ID, publication.pictureUid);
      } catch (e) {
        throw new BadRequestException('UnknownException: ' + e.message);
      }
      publication.pictureUid = pictureUid;
    }
    publication.title = updatePublicationDto.title;
    publication.description = updatePublicationDto.description;

    try {
      doc = await db.updateDocument(
        DB_ID,
        'PUBLICATIONS',
        publicationId,
        publication,
      );
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }

    return publicationBuilder.buildFromDoc(doc);
  }

  async remove(publicationId: string, connectedUserUid: string) {
    const publication = await this.findOne(publicationId);

    if (publication.authorUid != connectedUserUid) {
      throw new UnauthorizedException(
        'Only owners can update their publications',
      );
    }

    try {
      await db.deleteDocument(DB_ID, 'PUBLICATIONS', publicationId);
    } catch (e) {
      throw new BadRequestException('UnknownException: ' + e.message);
    }
    try {
      await storage.deleteFile(DB_ID, publication.pictureUid);
    } catch (e) {
      throw new NotFoundException('UnknownException: ' + e.message);
    }
  }
}
