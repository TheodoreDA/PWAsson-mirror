import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { Publication } from './entities/publication.entity';
import { publicationFactory } from 'src/factory/publication.factory';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from 'src/database/app.database';
import { InputFile, Models, Query } from 'node-appwrite';

@Injectable()
export class PublicationService {
  async create(
    createPublicationDto: CreatePublicationDto,
    picture: Express.Multer.File,
    authorUid: string,
  ) {
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
      await db.createDocument('DEV', 'PUBLICATIONS', publication.uid, {
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
    return publication;
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
      publications.push(
        publicationFactory
          .setUid(doc['uid'])
          .setTitle(doc['title'])
          .setDescription(doc['description'])
          .setPictureUid(doc['pictureUid'])
          .setLikes(doc['likes'])
          .build(),
      ),
    );
    return publications;
  }

  async findOne(publicationId: string) {
    let docs: Models.DocumentList<Models.Document>;

    try {
      docs = await db.listDocuments('DEV', 'PUBLICATIONS', [
        Query.equal('uid', publicationId),
      ]);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    if (docs.total == 0) {
      throw new NotFoundException(
        "Could not find publication with uid '" + publicationId + "'",
      );
    }
    if (docs.total > 1)
      throw new ConflictException(
        "Multiple publications with uid '" + publicationId + "'",
      );

    return publicationFactory
      .setUid(docs.documents[0]['uid'])
      .setTitle(docs.documents[0]['title'])
      .setDescription(docs.documents[0]['description'])
      .setPictureUid(docs.documents[0]['pictureUid'])
      .setLikes(docs.documents[0]['likes'])
      .build();
  }

  async getPicture(pictureId: string) {
    console.log('pictureIdd: ', pictureId);
    try {
      return storage.getFileView('DEV', pictureId);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(
    publicationId: string,
    picture: Express.Multer.File,
    updatePublicationDto: UpdatePublicationDto,
  ) {
    let doc: Models.Document;
    const publication = await this.findOne(publicationId);

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
      doc = await db.updateDocument('DEV', 'USERS', publicationId, publication);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return publicationFactory
      .setUid(doc['uid'])
      .setTitle(doc['title'])
      .setDescription(doc['description'])
      .setPictureUid(doc['pictureUid'])
      .setLikes(doc['likes'])
      .build();
  }

  async remove(publicationId: string) {
    const publication = await this.findOne(publicationId);

    try {
      await db.deleteDocument('DEV', 'USERS', publicationId);
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
