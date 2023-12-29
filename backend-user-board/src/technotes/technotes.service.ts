import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechNotesModel } from './entities/technotes.entity';

@Injectable()
export class TechnotesService {

    constructor(
        @InjectRepository(TechNotesModel)
        private techNotesRepo: Repository<TechNotesModel>
    ) { }

    async getAllTechNotes() {
        return this.techNotesRepo.find();
    }

}