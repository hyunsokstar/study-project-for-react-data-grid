import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechNotesModel } from '../entities/technotes.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from '../entities/skilnotes.entity';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';

@Injectable()
export class SkilnotesService {
    constructor(
        @InjectRepository(TechNotesModel)
        private techNotesRepo: Repository<TechNotesModel>,
        @InjectRepository(SkilNotesModel)
        private skilNotesRepo: Repository<SkilNotesModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
    ) { }
    async getAllSkilNoteList(
        pageNum: number = 1,
        perPage: number = 10
    ): Promise<{
        skilnoteList: SkilNotesModel[],
        totalCount: number,
        perPage: number,
    }> {
        // return this.techNotesRepo.find();

        const [skilnoteList, totalCount] = await this.skilNotesRepo.findAndCount({
            skip: (pageNum - 1) * perPage,
            take: perPage,
            relations: ['writer'], // 이 부분이 추가된 부분입니다. User 정보를 가져오도록 설정합니다.
            order: {
                id: 'DESC'
            }
        });

        return {
            skilnoteList,
            totalCount,
            perPage
        }

    }

    async createSkilnote(dto: dtoForCreateSkilNote) {
        const { title, description, category, writerId, techNoteId } = dto;

        const writer = await this.usersRepository.findOne({ where: { id: writerId } });
        const techNote = await this.techNotesRepo.findOne({ where: { id: techNoteId } })

        if (!writer) {
            // throw new Error('Writer not found'); // 작가를 찾을 수 없는 경우 예외 처리
            return { status: "error", message: `skilnote is not found for ${writerId}` };
        }

        if (!techNote) {
            throw new Error('techNote not found'); // 작가를 찾을 수 없는 경우 예외 처리
        }

        const skilNote = new SkilNotesModel();
        skilNote.title = title;
        skilNote.description = description;
        skilNote.category = category;
        skilNote.writer = writer;
        skilNote.techNote = techNote;

        return this.skilNotesRepo.save(skilNote);
    }

    async getSkilnotesForTechNote(
        techNoteId: number,
        pageNum: number = 1,
        perPage: number = 10
    ): Promise<{ skilNoteList: SkilNotesModel[], totalCount: number, perPage: number }> {
        // return this.skilNotesRepo.find({ where: { techNote: { id: techNoteId } } });

        const [skilNoteList, totalCount] = await this.skilNotesRepo.findAndCount({
            where: { techNote: { id: techNoteId } },
            skip: (pageNum - 1) * perPage,
            take: perPage,
            relations: ['writer'],
            order: {
                id: 'DESC'
            }
        });

        return {
            skilNoteList,
            totalCount,
            perPage
        }

    }

}
