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
  create(
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
    return this.publicationService.create(
      createPublicationDto,
      picture,
      payload.uid,
    );
  }

  @Get()
  findAll() {
    return this.publicationService.findAll();
  }

  @Get(':publicationId')
  findOne(@Param('publicationId') publicationId: string) {
    return this.publicationService.findOne(publicationId);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Patch(':publicationId')
  update(
    @Param('publicationId') publicationId: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationService.update(publicationId, updatePublicationDto);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Delete(':publicationId')
  remove(@Param('publicationId') publicationId: string) {
    return this.publicationService.remove(publicationId);
  }
}
