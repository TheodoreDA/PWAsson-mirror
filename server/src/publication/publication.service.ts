import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { Publication } from './entities/publication.entity';
import { publicationFactory } from 'src/factory/publication.factory';

@Injectable()
export class PublicationService {
  private publications: Publication[] = [];

  constructor() {
    this.publications.push(
      publicationFactory
        .setUid('1234567890')
        .setTitle('Title')
        .setDescription('Description')
        .setPictureUid('picture1')
        .setAuthorUid('author1')
        .setLikes(42)
        .build(),
    );
    this.publications.push(
      publicationFactory
        .setUid('0987654321')
        .setTitle('Title2')
        .setDescription('Description2')
        .setPictureUid('picture2')
        .setAuthorUid('author2')
        .setLikes(1)
        .build(),
    );
    this.publications.push(
      publicationFactory
        .setUid('6543210987')
        .setTitle('Title3')
        .setDescription('Description3')
        .setPictureUid('picture3')
        .setAuthorUid('author3')
        .setLikes(6)
        .build(),
    );
  }

  create(createPublicationDto: CreatePublicationDto, authorUid: string) {
    const publication = publicationFactory
      .setUid('6543210987')
      .setTitle(createPublicationDto.title)
      .setDescription(createPublicationDto.description)
      .setPictureUid('picture3')
      .setAuthorUid(authorUid)
      .build();

    this.publications.push(publication);
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
