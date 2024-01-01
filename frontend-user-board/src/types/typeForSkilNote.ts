export interface Writer {
    id: number;
    email: string;
    password: string;
    nickname: string;
    role: string;
    gender: string;
    phoneNumber: string | null;
    backEndLevel: number;
    frontEndLevel: number;
    profileImage: string | null;
}

export interface SkillNoteRow {
    id: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string | null;
    writer: Writer;
}

export interface SkillNoteListResponse {
    skilNoteList: SkillNoteRow[];
    totalCount: number;
    perPage: number;
}