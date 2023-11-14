import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { Publication } from './entities/publication.entity';
import { publicationFactory } from 'src/factory/publication.factory';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from 'src/database/app.database';
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
        'DEV',
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
      .setPictureUid(pictureUid)
      .build();

    try {
      doc = await db.createDocument('DEV', 'PUBLICATIONS', publication.uid, {
        ...publication.toObject(),
        author: authorUid,
      });
    } catch (e) {
      try {
        await storage.deleteFile('DEV', pictureUid);
      } catch (e) {
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
    return publicationFactory.buildfromDoc(doc);
  }

  async findAll() {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments('DEV', 'PUBLICATIONS');
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const publications: Publication[] = [];

    docs.documents.forEach((doc: Models.Document) =>
      publications.push(publicationFactory.buildfromDoc(doc)),
    );
    return publications;
  }

  async findOne(publicationId: string) {
    let doc: Models.Document;

    try {
      doc = await db.getDocument('DEV', 'PUBLICATIONS', publicationId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return publicationFactory.buildfromDoc(doc);
  }

  async getPicture(pictureId: string) {
    try {
      return storage.getFileView('DEV', pictureId);
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

    if (publication.author.toString() != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its publications');

    if (picture != undefined || picture != null) {
      const pictureUid = uuidv4();

      try {
        await storage.createFile(
          'DEV',
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
        'DEV',
        'PUBLICATIONS',
        publicationId,
        publication,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return publicationFactory.buildfromDoc(doc);
  }

  async remove(publicationId: string, connectedUserUid: string) {
    const publication = await this.findOne(publicationId);

    if (publication.author.toString() != connectedUserUid)
      throw new UnauthorizedException('Only owner can update its publications');

    try {
      await db.deleteDocument('DEV', 'PUBLICATIONS', publicationId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    try {
      await storage.deleteFile('DEV', publication.pictureUid);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
