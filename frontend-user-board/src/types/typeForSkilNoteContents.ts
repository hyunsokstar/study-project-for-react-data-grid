
// SkilNoteContentsModel.ts
export interface SkilNoteContentsRow {
    id: number;
    title: string;
    file: string;
    content: string;
    page: number;
    order: number;
    createdAt: string; // 혹은 Date 타입으로 변환하여 사용
    updatedAt: string | null; // 혹은 Date 타입으로 변환하여 사용
}

export type responseTypeForGetSkilNoteContents = {
    title: string;
    writer: Writer;
    skilnoteContents: SkilNoteContentsRow[]
};