import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechNotesModel } from '../entities/technotes.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from '../entities/skilnotes.entity';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';
import { SkilNoteContentsModel } from '../entities/skilnote_contents.entity';
import { dtoForCreateSkilNoteContent } from '../dtos/dtoForCreateSkilNoteContents';

@Injectable()
export class SkilnotesService {
    constructor(
        @InjectRepository(TechNotesModel)
        private techNotesRepo: Repository<TechNotesModel>,
        @InjectRepository(SkilNotesModel)
        private skilNotesRepo: Repository<SkilNotesModel>,
        @InjectRepository(SkilNoteContentsModel)
        private skilNoteContentsRepo: Repository<SkilNoteContentsModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
    ) { }

    async createSkilNoteContents(dto: dtoForCreateSkilNoteContent) {
        const { title, file, content, page, order, writerId, skilNoteId } = dto;
        // todo 
        const writerObj = await this.usersRepository.findOne({ where: { id: writerId } });
        const skilNoteObj = await this.skilNotesRepo.findOne({ where: { id: skilNoteId } })

        if (!writerObj || !skilNoteObj) {
            throw new Error('writerId나 skilNoteId가 필요합니다.');
        }

        const skilNoteContentsObj = new SkilNoteContentsModel();
        skilNoteContentsObj.title = title;
        skilNoteContentsObj.file = file;
        skilNoteContentsObj.content = content;
        skilNoteContentsObj.page = page;
        skilNoteContentsObj.order = order;
        skilNoteContentsObj.writer = writerObj
        skilNoteContentsObj.skilNote = skilNoteObj
        return this.skilNoteContentsRepo.save(skilNoteContentsObj);
    }

    async getSkilNoteContentsBySkilNoteId(skilnoteId: string) {
        const options: FindManyOptions<SkilNoteContentsModel> = {
            where: { skilNote: { id: parseInt(skilnoteId) } },
        };
        return this.skilNoteContentsRepo.find(options);
    }

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
        const { title, description, category, email, techNoteId } = dto;

        const writer = await this.usersRepository.findOne({ where: { email: email } });
        const techNote = await this.techNotesRepo.findOne({ where: { id: techNoteId } })

        if (!writer) {
            // throw new Error('Writer not found'); // 작가를 찾을 수 없는 경우 예외 처리
            return { status: "error", message: `skilnote is not found for ${email}` };
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

    async saveSkilNoteRows(skilNotesToSave: any[], loginUser: UsersModel): Promise<any> {

        console.log("skilNotesToSave : ", skilNotesToSave);
        console.log("skilNotesToSave.length : ", skilNotesToSave.length);

        let count = 0;

        for (const note of skilNotesToSave) {
            const { id, title, description, category, email, ...data } = note;

            const writerObj = await this.usersRepository.findOne({
                where: {
                    email: email
                }
            });

            if (id) {
                console.log("id : ", id);
                const existingNote = await this.skilNotesRepo.findOne({ where: { id: id } }); // 변경된 부분

                if (existingNote) {
                    count++;
                    console.log("update here");
                    await this.skilNotesRepo.update(id, {
                        title: title,
                        description: description,
                        category: category,
                        updatedAt: new Date(),
                        writer: writerObj
                    });
                } else {
                    console.log("save here");
                    count++;

                    if (!loginUser) {
                        return { status: "error", message: `login is required to add tech note` }
                    }

                    await this.skilNoteContentsRepo
                        .save({
                            title: title,
                            description: description,
                            category: category,
                            createdAt: new Date(),
                            writer: loginUser
                        });
                }


            }
        }
        return { message: `save skil note is successfully excuted ${count}` };
    }

}
