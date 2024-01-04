import { IsString, IsNumber, IsOptional } from 'class-validator';

export class dtoForCreateSkilNoteContent {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    file?: string;

    @IsString()
    @IsOptional()
    content?: string;

    // @IsNumber()
    // @IsOptional()
    // page?: number;

    // @IsNumber()
    // @IsOptional()
    // order?: number;

    @IsOptional()
    createdAt?: Date;

    @IsNumber()
    writerId: number

    // @IsNumber()
    // skilNoteId: string
}
