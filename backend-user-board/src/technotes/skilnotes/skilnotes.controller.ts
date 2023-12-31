import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SkilnotesService } from './skilnotes.service';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';
import { dtoForCreateSkilNoteContent } from '../dtos/dtoForCreateSkilNoteContents';
import { AuthGuard } from 'src/guards/auth.guard';
import { dtoForReorderContents } from '../dtos/dtoForReorderContents';
import { DeleteSkilNoteContentsDto } from 'src/users/dtos/DeleteSkilNoteContentsDto';

@Controller('skilnotes')
export class SkilnotesController {
    constructor(private readonly skilnoteService: SkilnotesService) { }

    @Get()
    async getAllTechNoteList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 10,
        @Req() req: Request
    ) {
        return this.skilnoteService.getAllSkilNoteList(pageNum, perPage);
    }

    @Post() // POST 요청을 처리하는 엔드포인트 추가
    async createTechNote(@Body() dto: dtoForCreateSkilNote) {
        return this.skilnoteService.createSkilnote(dto);
    }

    @Get('byTechNoteId/:techNoteId') // 기존에 사용하던 Get 엔드포인트에 파라미터를 추가합니다.
    async getSkilnotesForTechNote(
        @Param('techNoteId') techNoteId: number,
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 10,
    ) {
        return this.skilnoteService.getSkilnotesForTechNote(techNoteId);
    }

    @Get(':skilnoteId/contents/:pageNum')
    async getSkilNoteContents(
        @Param('skilnoteId') skilnoteId: string,
        @Param('pageNum') pageNum: string
    ) {
        console.log("hi");
        return this.skilnoteService.getSkilNoteContentsBySkilNoteId(skilnoteId, pageNum);
    }

    @Post('saveRows')
    async saveSkilNoteRows(@Body() dataForNoteRows: dtoForCreateSkilNoteContent[], @Req() req: Request) {
        console.log("dataForNoteRows : ", dataForNoteRows)
        const loginUser = req['user']
        return this.skilnoteService.saveSkilNoteRows(dataForNoteRows, loginUser);
    }

    // http://127.0.0.1:8080/skilnotes/:skilnoteId/contents/:pageNum
    @UseGuards(AuthGuard)
    @Post(':skilNoteId/contents/:pageNum')
    async createSkilNoteContents(
        @Req() req: Request,
        @Body() dto: dtoForCreateSkilNoteContent,
        @Param('skilNoteId') skilNoteId: string,
        @Param('pageNum') pageNum: string,
        @Res() response
    ) {
        const loginUser = req['user'];
        console.log("pageNum : ", pageNum);

        console.log("loginUser at create skilnote contents: ", loginUser);
        // if (loginUser === undefined) {
        //     return response.status(HttpStatus.UNAUTHORIZED).json({
        //         status: "error",
        //         message: '로그인 사용자만 skilnote content 를 입력 가능',
        //     });
        // }

        console.log("skilNoteId : ", skilNoteId);
        console.log("skilnote content 입력 check !");

        const result = await this.skilnoteService.createSkilNoteContents(skilNoteId, pageNum, loginUser, dto);
        return response.status(HttpStatus.CREATED).json({ message: "create skilnote contents success", result: result });

    }

    @Put('contents/reorder')
    async reorderingSkilNoteContents(@Body() contents: dtoForReorderContents[]) {
        console.log("reorder 요청 check ", contents);
        const updatedContents = await this.skilnoteService.reorderContents(contents);
        return updatedContents;
    }

    // http://127.0.0.1:8080/skilnotes/content/:skilNoteContetId
    @UseGuards(AuthGuard)
    @Put('content/:skilNoteContentId')
    async updateSkilNoteContent(
        @Req() req: Request,
        @Param('skilNoteContentId') skilNoteContentId: string,
        @Body() dto: dtoForCreateSkilNoteContent,
        @Res() response
    ) {
        const loginUser = req['user'];

        if (!loginUser) {

        }

        console.log("loginUser at create skilnote contents: ", loginUser);
        console.log("skilNoteContentId : ", skilNoteContentId);
        console.log("skilnote content 입력 check !");

        const result = await this.skilnoteService.updateSkilNoteContent(skilNoteContentId, dto, loginUser);
        return response.status(HttpStatus.CREATED).json({ message: "update skilnote content success", result: result });
    }

    @UseGuards(AuthGuard)
    @Delete('content/deleteByCheckedIds')
    async deleteSkilNoteContentsByCheckedIds(
        @Req() req: Request,
        @Body() checkedIds: DeleteSkilNoteContentsDto,
        @Res() response
    ) {
        const loginUser = req['user'];

        if (!loginUser) {
        }

        console.log("checkdIds : ", checkedIds);
        console.log("skilnote content 입력 check !");

        // const result = await this.skilnoteService.deleteSkilNoteContentForCheckedIds(checkedIds, loginUser);
        // // return response.status(HttpStatus.CREATED).json({ message: "update skilnote content success", result: result });
        try {
            const result = await this.skilnoteService.deleteSkilNoteContentForCheckedIds(checkedIds, loginUser);
            return response.status(200).json({ message: 'Skilnote content deleted successfully', result }); // 성공적으로 삭제됨 응답
        } catch (error) {
            return response.status(500).json({ message: 'Error deleting skilnote content', error: error.message }); // 삭제 중 에러 발생 응답
        }


    }

}
