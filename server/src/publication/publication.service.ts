import {
  BadRequestException,
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
import { InputFile } from 'node-appwrite';

@Injectable()
export class PublicationService {
  private publications: Publication[] = [];

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

  findAll() {
    return this.publications;
  }

  findOne(publicationId: string) {
    const publication = this.publications.find(
      (publication) => publication.uid == publicationId,
    );

    if (publication == undefined)
      throw new NotFoundException(
        "Could not find publication with id '" + publicationId + "'",
      );
    return publication;
  }

  // TODO: Check if requesting user is the author
  update(publicationId: string, updatePublicationDto: UpdatePublicationDto) {
    const publicationIdx = this.publications.findIndex(
      (publication) => publication.uid == publicationId,
    );

    if (publicationIdx == -1) {
      throw new NotFoundException(
        "Could not find publication '" + publicationId + "'",
      );
    }
    if (updatePublicationDto.title)
      this.publications[publicationIdx].title = updatePublicationDto.title;
    if (updatePublicationDto.description) {
      this.publications[publicationIdx].description =
        updatePublicationDto.description;
    }
    return this.publications[publicationIdx];
  }

  // TODO: Check if requesting user is the author
  remove(publicationId: string) {
    const publicationIdx = this.publications.findIndex(
      (publication) => publication.uid == publicationId,
    );

    if (publicationIdx == -1) {
      throw new NotFoundException(
        "Could not find publication '" + publicationId + "'",
      );
    }
    this.publications.splice(publicationIdx, 1);
  }
}
