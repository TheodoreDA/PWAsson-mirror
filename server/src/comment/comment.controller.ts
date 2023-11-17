import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiCreatedResponse({
    description: 'The created Comment',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Could not find Publication',
  })
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Body('payload') payload: Payload,
  ): Promise<Comment> {
    return await this.commentService.create(createCommentDto, payload.uid);
  }

  @ApiQuery({
    name: 'pages',
    description: 'The offset that chunks the results in pages of 25.',
    type: Number,
    required: false,
  })
  @ApiOkResponse({
    type: Comment,
    isArray: true,
  })
  @Get('/:publicationId')
  async findAll(
    @Param('publicationId') publicationId: string,
    @Query('pages') pages = 0,
  ): Promise<Comment[]> {
    return await this.commentService.findAll(publicationId, pages);
  }

  @ApiOkResponse({
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Comment',
  })
  @Get('/one/:commentId')
  async findOne(@Param('commentId') commentId: string): Promise<Comment> {
    return await this.commentService.findOne(commentId);
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiOkResponse({
    description:
      'The Comment has been liked or unliked, depending on the previous state',
  })
  @ApiNotFoundResponse({
    description: 'Could not find the connected User or the Comment',
  })
  @Patch('like_unlike/:commentId')
  async likeUnlike(
    @Param('commentId') commentId: string,
    @Body('payload') payload: Payload,
  ): Promise<void> {
    return await this.commentService.likeUnlike(payload.uid, commentId);
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiOkResponse({
    description: 'The Comment modified',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Comment',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can modify their comments',
  })
  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Body('payload') payload: Payload,
  ): Promise<Comment> {
    return await this.commentService.update(
      commentId,
      payload.uid,
      updateCommentDto,
    );
  }

  @ApiBearerAuth()
  @UseInterceptors(AccessTokenInterceptor)
  @ApiOkResponse({
    description: 'Comment deleted',
  })
  @ApiNotFoundResponse({
    description: 'Could not find the Comment',
  })
  @ApiUnauthorizedResponse({
    description: 'Only owners can update their comments',
  })
  @Delete(':commentId')
  async remove(
    @Param('commentId') commentId: string,
    @Body('payload') payload: Payload,
  ): Promise<void> {
    return await this.commentService.remove(commentId, payload.uid);
  }
}
