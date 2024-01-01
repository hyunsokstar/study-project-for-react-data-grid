// dtoForCreateTechNote.dto.ts 파일

import { IsString, IsNumber } from 'class-validator';

export class dtoForCreateSkilNote {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsNumber()
    writerId: number;

    @IsNumber()
    techNoteId: number;
}
