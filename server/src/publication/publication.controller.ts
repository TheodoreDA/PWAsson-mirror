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
  Query,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { oneMb } from 'src/app.constants';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Publication } from './entities/publication.entity';

@ApiTags('Publication')
@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  @ApiCreatedResponse({
    description: 'The Message created',
    type: Publication,
  })
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
  ): Promise<Publication> {
    return await this.publicationService.create(
      createPublicationDto,
      picture,
      payload.uid,
    );
  }

  @ApiQuery({
    name: 'pages',
    description: 'The offset that chunks the results in pages of 25.',
    type: Number,
    required: false,
  })
  @ApiOkResponse({
    type: Publication,
    isArray: true,
  })
  @Get()
  async findAll(@Query('pages') pages = 0): Promise<Publication[]> {
    return await this.publicationService.findAll(pages);
  }

  @ApiOkResponse({
    type: Publication,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Publication',
  })
  @Get(':publicationId')
  async findOne(
    @Param('publicationId') publicationId: string,
  ): Promise<Publication> {
    return await this.publicationService.findOne(publicationId);
  }

  @ApiOkResponse({
    description: 'The Picture as a Buffer',
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Picture',
  })
  @Get('picture/:pictureId')
  async getPicture(@Param('pictureId') pictureId: string): Promise<Buffer> {
    return await this.publicationService.getPicture(pictureId);
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiOkResponse({
    description:
      'The Publication has been liked or unliked, depending on the previous state',
  })
  @ApiNotFoundResponse({
    description: 'Could not find the connected User or the Publication',
  })
  @Patch('like_unlike/:publicationId')
  async likeUnlike(
    @Param('publicationId') publicationId: string,
    @Body('payload') payload: Payload,
  ): Promise<void> {
    return await this.publicationService.likeUnlike(payload.uid, publicationId);
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  @ApiOkResponse({
    description: 'The Publication modified',
    type: Publication,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Publication',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can modify their publications',
  })
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
  ): Promise<Publication> {
    return await this.publicationService.update(
      publicationId,
      picture,
      payload.uid,
      updatePublicationDto,
    );
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiOkResponse({
    description: 'Publication deleted',
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Publication',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can update their publications',
  })
  @Delete(':publicationId')
  async remove(
    @Param('publicationId') publicationId: string,
    @Body('payload') payload: Payload,
  ): Promise<void> {
    return await this.publicationService.remove(publicationId, payload.uid);
  }
}
