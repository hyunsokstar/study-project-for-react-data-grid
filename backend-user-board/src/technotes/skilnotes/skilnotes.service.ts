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

    async createSkilNoteContents(skilNoteId: string, dto: dtoForCreateSkilNoteContent) {
        const { title, file, content, page, writerId } = dto;
        console.log("skilnoteId : ", skilNoteId);
        console.log("skilnoteId : ", typeof skilNoteId);

        // todo 
        const writerObj = await this.usersRepository.findOne({ where: { id: writerId } });
        const skilNoteObj = await this.skilNotesRepo.findOne({ where: { id: parseInt(skilNoteId) } })

        if (!writerObj || !skilNoteObj) {
            throw new Error('writerId나 skilNoteId가 필요합니다.');
        }

        const existingSkilNoteContents = await this.skilNoteContentsRepo.find({
            where: { skilNote: { id: parseInt(skilNoteId) } },
            order: { order: 'DESC' }, // order를 내림차순으로 정렬하여 최대값을 가져옴
            take: 1 // 최대값 하나만 가져오기
        });

        const maxOrder = existingSkilNoteContents.length > 0 ? existingSkilNoteContents[0].order : 0;


        const skilNoteContentsObj = new SkilNoteContentsModel();
        skilNoteContentsObj.title = title;
        skilNoteContentsObj.file = file;
        skilNoteContentsObj.content = content;
        skilNoteContentsObj.page = page;
        skilNoteContentsObj.order = maxOrder + 1;
        skilNoteContentsObj.writer = writerObj
        skilNoteContentsObj.skilNote = skilNoteObj
        return this.skilNoteContentsRepo.save(skilNoteContentsObj);
    }

    async getSkilNoteContentsBySkilNoteId(skilnoteId: any) {
        const options: FindManyOptions<SkilNoteContentsModel> = {
            where: { skilNote: { id: parseInt(skilnoteId) } },
        };

        const skilnoteContents = await this.skilNoteContentsRepo.find(options)

        // 추가로 필요 skilnote Info by skilNoteId
        const skilNoteInfo = await this.skilNotesRepo
            .findOne({
                where: { id: skilnoteId },
                relations: ['writer'] // 작성자 정보를 포함하기 위한 관계 설정
            })
        console.log("skilNoteInfo : ", skilNoteInfo);

        const responseObj = {
            title: skilNoteInfo.title,
            writer: skilNoteInfo.writer,
            countForSkilNoteContents: (await skilnoteContents).length,
            skilnoteContents: skilnoteContents
        }

        return responseObj;
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
            const { id, title, description, category, email, techNoteId, ...data } = note;

            const writerObj = await this.usersRepository.findOne({
                where: {
                    email: email
                }
            });
            const techNoteObj = await this.techNotesRepo.findOne({
                where: {
                    id: techNoteId
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
                        writer: writerObj,
                        techNote: techNoteObj
                    });
                } else {
                    console.log("save here");
                    count++;

                    if (!loginUser) {
                        return { status: "error", message: `login is required to add skil note` }
                    }

                    await this.skilNotesRepo
                        .save({
                            title: title,
                            description: description,
                            category: category,
                            createdAt: new Date(),
                            writer: loginUser,
                            techNote: techNoteObj
                        });
                }


            }
        }
        return { message: `save skil note is successfully excuted ${count}` };
    }

}
