import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { SkilnotesService } from './skilnotes.service';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';
import { dtoForCreateSkilNoteContent } from '../dtos/dtoForCreateSkilNoteContents';

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

    @Get(':skilnoteId/contents')
    async getSkilNoteContents(@Param('skilnoteId') skilnoteId: string) {
        return this.skilnoteService.getSkilNoteContentsBySkilNoteId(skilnoteId);
    }

    // http://127.0.0.1:8080/skilnotes/:skilnoteId/contents
    @Post(':skilNoteId/contents')
    async createSkilNoteContents(
        @Param('skilNoteId') skilNoteId: string,
        @Body() dto: dtoForCreateSkilNoteContent
    ) {
        console.log("skilNoteId : ", skilNoteId);
        return this.skilnoteService.createSkilNoteContents(skilNoteId, dto);
    }

    @Post('saveRows')
    async saveSkilNoteRows(@Body() dataForNoteRows: dtoForCreateSkilNoteContent[], @Req() req: Request) {
        console.log("dataForNoteRows : ", dataForNoteRows)
        const loginUser = req['user']
        return this.skilnoteService.saveSkilNoteRows(dataForNoteRows, loginUser);
    }

}
