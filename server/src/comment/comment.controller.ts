import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AccessTokenInterceptor } from 'src/interceptor/token.interceptor';
import { Payload } from 'src/auth/dto/payload';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseInterceptors(AccessTokenInterceptor)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Body('payload') payload: Payload,
  ) {
    return await this.commentService.create(createCommentDto, payload.uid);
  }

  @Get('/:publicationId')
  async findAll(@Param('publicationId') publicationId: string) {
    return await this.commentService.findAll(publicationId);
  }

  @Get('/one/:commentId')
  async findOne(@Param('commentId') commentId: string) {
    return await this.commentService.findOne(commentId);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Patch('like_unlike/:commentId')
  async likeUnlike(
    @Param('commentId') commentId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.commentService.likeUnlike(payload.uid, commentId);
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Body('payload') payload: Payload,
  ) {
    return await this.commentService.update(
      commentId,
      payload.uid,
      updateCommentDto,
    );
  }

  @UseInterceptors(AccessTokenInterceptor)
  @Delete(':commentId')
  async remove(
    @Param('commentId') commentId: string,
    @Body('payload') payload: Payload,
  ) {
    return await this.commentService.remove(commentId, payload.uid);
  }
}
