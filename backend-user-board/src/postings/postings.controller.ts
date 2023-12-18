// postings.controller.ts

import { Body, Controller, Get, Post, Delete, Param, Res, HttpStatus, Query, NotFoundException } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { CreatePostingDto } from './dtos/create-posting.dto';
import { UserPostingsModel } from './entities/user_postings.entity';

@Controller('postings')
export class PostingsController {

    constructor(private readonly postingsService: PostingsService) { }

    @Get()
    async getAllPostings(
        @Query('pageNum') pageNum: number = 1,
    ): Promise<{ postings: UserPostingsModel[], totalCount: number, perPage: number }> {
        return this.postingsService.getAllPostings();
    }

    @Post()
    async createPosting(@Body() createPostingDto: CreatePostingDto) {
        console.log("Controller - createPostingDto : ", createPostingDto);
        return this.postingsService.createPosting(createPostingDto);
    }

    @Delete(':id')
    async deletePosting(@Param('id') id: string, @Res() response): Promise<void> {
        const postingId = parseInt(id, 10);

        try {
            await this.postingsService.deletePosting(postingId);
            response.status(HttpStatus.OK).send({ message: '게시물이 성공적으로 삭제되었습니다.' });
        } catch (error) {
            response.status(500).send({ message: '게시물 삭제 중 오류가 발생했습니다.' });
        }
    }

    @Get('user/:userId')
    async getUserPostings(
        @Param('userId') userId: string,
        @Query('pageNum') pageNum = '1',
        @Query('perPage') perPage = '10',
    ) {

        console.log("posting list 요청 check");

        try {
            const userPostings = await this.postingsService.getUserPostings(
                parseInt(userId, 10),
                parseInt(pageNum, 10),
                parseInt(perPage, 10),
            );

            return {
                success: true,
                data: {
                    postings: userPostings.postings,
                    totalCount: userPostings.totalCount,
                    perPage: userPostings.perPage,
                },
                message: `Retrieved postings for user ${userId} (page ${pageNum})`,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {
                    success: false,
                    message: error.message,
                };
            }
            return {
                success: false,
                message: 'Failed to retrieve user postings : ' + error,
            };
        }
    }

}