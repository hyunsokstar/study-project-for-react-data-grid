import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { TechnotesService } from "./technotes.service";
import { DtoForCreateTechNote } from "./dtos/dtoForCreateTechNote.dto";

@Controller('technotes')
export class TechnotesController {

    constructor(private readonly technotesService: TechnotesService) { }

    @Get()
    async getAllTechNoteList(
        @Query('pageNum') pageNum = 1,
        @Query('perPage') perPage = 10,
        @Req() req: Request
    ) {
        // console.log("req['user'] 2: ", req['user']);

        return this.technotesService.getAllTechNotes(pageNum, perPage);
    }

    @Post() // POST 요청을 처리하는 엔드포인트 추가
    async createTechNote(@Body() dto: DtoForCreateTechNote) {
        return this.technotesService.createTechNote(dto);
    }

    @Post('saveTechNotes') // API 엔드포인트 추가
    async saveTodos(@Body() techNotesToSave: any, @Req() req: Request) {
        console.log("techNotesToSave at controller : ", techNotesToSave);
        console.log("req['user']3 : ", req['user']);

        return this.technotesService.saveTechNotes(techNotesToSave, req['user']);
    }


}