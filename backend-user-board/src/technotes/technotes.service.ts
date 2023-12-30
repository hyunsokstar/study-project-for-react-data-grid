import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechNotesModel } from './entities/technotes.entity';
import { DtoForCreateTechNote } from './dtos/dtoForCreateTechNote.dto';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class TechnotesService {

    constructor(
        @InjectRepository(TechNotesModel)
        private techNotesRepo: Repository<TechNotesModel>,

        @InjectRepository(UsersModel) // UsersModel의 Repository를 주입합니다.
        private readonly usersRepository: Repository<UsersModel>,

    ) { }

    async createTechNote(dto: DtoForCreateTechNote) {
        const { title, description, category, writerId } = dto;
        const writer = await this.usersRepository.findOne({ where: { id: writerId } });

        const techNote = new TechNotesModel();
        techNote.title = title;
        techNote.description = description;
        techNote.category = category;

        // Assume 'writerId' corresponds to an existing user ID in the 'UsersModel'
        // Find the user by ID
        if (!writer) {
            throw new Error('Writer not found'); // 작가를 찾을 수 없는 경우 예외 처리
        }

        techNote.writer = writer; // Assign the writer object to the tech note

        return this.techNotesRepo.save(techNote);
    }

    async getAllTechNotes(
        pageNum: number = 1,
        perPage: number = 10
    ): Promise<{
        techNoteList: TechNotesModel[],
        totalCount: number,
        perPage: number,
    }> {
        // return this.techNotesRepo.find();

        const [techNoteList, totalCount] = await this.techNotesRepo.findAndCount({
            skip: (pageNum - 1) * perPage,
            take: perPage,
            relations: ['writer'], // 이 부분이 추가된 부분입니다. User 정보를 가져오도록 설정합니다.
            order: {
                id: 'DESC'
            }
        });

        return {
            techNoteList,
            totalCount,
            perPage
        }

    }

}