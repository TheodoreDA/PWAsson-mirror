import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { publicationFactory } from 'src/factory/publication.factory';
import { v4 as uuidv4 } from 'uuid';
import { DB_ID, db, storage } from 'src/database/app.database';
import { InputFile, Models } from 'node-appwrite';

@Injectable()
export class PublicationService {
  async create(
    createPublicationDto: CreatePublicationDto,
    picture: Express.Multer.File,
    authorUid: string,
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
      throw new BadRequestException(e.message);
    }
    const publication = publicationFactory
      .setUid(uuidv4())
      .setTitle(createPublicationDto.title)
      .setDescription(createPublicationDto.description)
      .setAuthorUid(authorUid)
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
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
    return publicationFactory.buildFromDoc(doc);
  }

  async findAll() {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments(DB_ID, 'PUBLICATIONS');
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return publicationFactory.buildFromDocs(docs);
  }

  async findOne(publicationId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument(DB_ID, 'PUBLICATIONS', publicationId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return publicationFactory.buildFromDoc(doc);
  }

  async getPicture(pictureId: string) {
    try {
      return storage.getFileView(DB_ID, pictureId);
    } catch (e) {
      throw new BadRequestException(e.message);
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

    if (publication.authorUid != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its publications');

    if (picture != undefined || picture != null) {
      const pictureUid = uuidv4();

      try {
        await storage.createFile(
          DB_ID,
          pictureUid,
          InputFile.fromPath(picture.path, picture.originalname),
        );
      } catch (e) {
        throw new BadRequestException(e.message);
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
      throw new BadRequestException(e.message);
    }

    return publicationFactory.buildFromDoc(doc);
  }

  async remove(publicationId: string, connectedUserUid: string) {
    const publication = await this.findOne(publicationId);

    if (publication.authorUid != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its publications');

    try {
      await db.deleteDocument(DB_ID, 'PUBLICATIONS', publicationId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    try {
      await storage.deleteFile(DB_ID, publication.pictureUid);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
