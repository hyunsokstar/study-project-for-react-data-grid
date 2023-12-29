import { Controller, Get } from "@nestjs/common";
import { TechnotesService } from "./technotes.service";

@Controller('technotes')
export class TechnotesController {

    constructor(private readonly technotesService: TechnotesService) { }

    @Get()
    async getAllTechNoteList() {
        return this.technotesService.getAllTechNotes();
    }

}