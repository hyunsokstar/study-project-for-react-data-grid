import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SkilnotesService } from './skilnotes.service';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';
import { dtoForCreateSkilNoteContent } from '../dtos/dtoForCreateSkilNoteContents';
import { AuthGuard } from 'src/guards/auth.guard';

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

}
