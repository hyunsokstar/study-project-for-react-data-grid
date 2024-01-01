import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { SkilnotesService } from './skilnotes.service';
import { DtoForCreateTechNote } from '../dtos/dtoForCreateTechNote.dto';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';

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

}
