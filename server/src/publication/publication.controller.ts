import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { oneMb } from 'src/app.constants';

@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @UseInterceptors(AccessTokenInterceptor)
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  @Post()
  async create(
    @Body() createPublicationDto: CreatePublicationDto,
    @Body('payload') payload: Payload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: oneMb * 3 }),
          new FileTypeValidator({ fileType: '(jpg|jpeg|png)$' }),
        ],
      }),
    )
    picture: Express.Multer.File,
  ) {
    return await this.publicationService.create(
      createPublicationDto,
      picture,
      payload.uid,
    );
  }

  @Get()
  async findAll() {
    return await this.publicationService.findAll();
  }

  @Get(':publicationId')
  async findOne(@Param('publicationId') publicationId: string) {
    return await this.publicationService.findOne(publicationId);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  @Patch(':publicationId')
  async update(
    @Param('publicationId') publicationId: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: oneMb * 3 }),
          new FileTypeValidator({ fileType: '(jpg|jpeg|png)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    picture: Express.Multer.File,
    @Body('payload') payload: Payload,
  ) {
    if (publicationId != payload.uid) {
      throw new UnauthorizedException('Only owner can update its publications');
    }
    return await this.publicationService.update(
      publicationId,
      picture,
      updatePublicationDto,
    );
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Delete(':publicationId')
  async remove(
    @Param('publicationId') publicationId: string,
    @Body('payload') payload: Payload,
  ) {
    if (publicationId != payload.uid) {
      throw new UnauthorizedException('Only owner can remove its publications');
    }
    return await this.publicationService.remove(publicationId);
  }
}
