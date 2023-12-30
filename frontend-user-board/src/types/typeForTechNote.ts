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

type TechNote = {
    type: "MASTER";
    id: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    writer: Writer;
    updatedAt?: string | null;
    expanded?: boolean;
    parentId?: any;
} |
{
    type: "DETAIL",
    id: any;
    parentId: number;
}

type ResponseDataTypeForGetAllTechNoteList = {
    techNoteList: TechNote[];
    totalCount: number;
    perPage: number;
}
