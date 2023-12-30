interface Writer {
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

interface TechNote {
    id: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt?: string | null;
    writer: Writer;
    type?: string;
    expanded?: boolean
}

interface ResponseDataTypeForGetAllTechNoteList {
    techNoteList: TechNote[];
    totalCount: number;
    perPage: number;
}
