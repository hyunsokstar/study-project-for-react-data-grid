import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechNotesModel } from '../entities/technotes.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from '../entities/skilnotes.entity';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';
import { SkilNoteContentsModel } from '../entities/skilnote_contents.entity';
import { dtoForCreateSkilNoteContent } from '../dtos/dtoForCreateSkilNoteContents';
import { dtoForReorderContents } from '../dtos/dtoForReorderContents';
import { DeleteSkilNoteContentsDto } from 'src/users/dtos/DeleteSkilNoteContentsDto';

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

    async reorderContents(contents: dtoForReorderContents[]) {
        const updatedContents = [];

        console.log("contents : ", contents);


        for (const [index, content] of contents.entries()) {
            const { id, order } = content;

            await this.skilNoteContentsRepo.update(
                { id }, // 해당 ID에 대해
                { order: index + 1 }, // 주어진 order 값으로 업데이트
            );

            // 업데이트된 정보를 findOne 메서드로 얻기
            const updatedContent =
                await this.skilNoteContentsRepo.findOne({ where: { id } });

            if (updatedContent) {
                updatedContents.push(updatedContent);
            } else {
                console.error(`Failed to find updated content with ID ${id}`);
            }
        }

        return updatedContents;
    }




    async createSkilNoteContents(skilNoteId: string, pageNum: any, loginUser, dto: dtoForCreateSkilNoteContent) {
        const { title, file, content } = dto;
        console.log("skilnoteId : ", skilNoteId);
        console.log("skilnoteId : ", typeof skilNoteId);

        // todo 
        // const writerObj = await this.usersRepository.findOne({ where: { id: writerId } });
        const skilNoteObj = await this.skilNotesRepo.findOne({ where: { id: parseInt(skilNoteId) } })

        if (!loginUser || !skilNoteObj) {
            throw new Error('loginUser or skilNoteId가 필요합니다.');
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
        skilNoteContentsObj.page = pageNum;
        skilNoteContentsObj.order = maxOrder + 1;
        skilNoteContentsObj.writer = loginUser
        skilNoteContentsObj.skilNote = skilNoteObj
        const saveResult = await this.skilNoteContentsRepo.save(skilNoteContentsObj);

        console.log("saveResult : ", saveResult);

        return saveResult;
    }

    async getSkilNoteContentsBySkilNoteId(skilnoteId: any, pageNum: any) {
        const options: FindManyOptions<SkilNoteContentsModel> = {
            where: { skilNote: { id: parseInt(skilnoteId) }, page: pageNum },
            order: { order: 'ASC' } // order 속성을 사용하여 오름차순 정렬
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

    async updateSkilNoteContent(skilNoteContentId: string, dto: dtoForCreateSkilNoteContent, loginUser) {
        console.log("skilNoteContentId : ", skilNoteContentId);
        console.log("skilNoteContentId : ", typeof skilNoteContentId);

        if (!loginUser || !skilNoteContentId) {
            throw new Error('loginUser or skilNoteId가 필요합니다.');
        }

        const skilNoteContentObj =
            await this.skilNoteContentsRepo.findOne({
                where: { id: parseInt(skilNoteContentId) },
                relations: ['writer']
            })

        if (skilNoteContentObj.writer.email !== loginUser.email) {
            throw new Error("작성자만 수정 할 수 있습니다.");
        }

        const update_result = await this.skilNoteContentsRepo.update(skilNoteContentId, {
            title: dto.title,
            file: dto.file,
            content: dto.content,
        });

        return update_result;
    }

    async deleteSkilNoteContentForCheckedIds(
        { checkedIds }: DeleteSkilNoteContentsDto,
        loginUser
    ) {
        try {
            console.log("check by checked ids for skilnote contents : ", checkedIds);

            // checkedIds에 해당하는 모든 ID에 대해 삭제
            for (const id of checkedIds) {
                const content = await this.skilNoteContentsRepo.findOne({ where: { id: id } });

                if (!content) {
                    throw new NotFoundException(`Content with ID ${id} not found.`);
                }

                if (content.writer && content.writer.email !== loginUser.email) {
                    throw new HttpException('작성자만 삭제 가능합니다.', HttpStatus.UNAUTHORIZED);
                }

                await this.skilNoteContentsRepo.remove(content);
            }
            return { success: true };
        } catch (error) {
            throw new Error(`Error deleting skilnote content: ${error.message}`);
        }
    }


}
