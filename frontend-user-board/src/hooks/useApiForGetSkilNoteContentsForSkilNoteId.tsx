import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ITypeForResponseDataForGetAllUsers, IUser } from '@/types/typeForUserBoard';
import { apiForGetSkilNoteContentListForSkilNoteId } from '@/api/apiForSkilNote';
import { SkilNoteContentsRow } from '@/types/typeForSkilNoteContents';

type typeForSkilNoteContentRow = {
    id: number;
    title: string;
    file: string;
    content: string;
    page: number;
    order: number;
    createdAt: string;
    updatedAt: string | null;
}


type responseTypeForGetSkilNoteContents = {
    title: string;
    writer: Writer;
    skilnoteContents: typeForSkilNoteContentRow[]
};

const useApiForGetSkilNoteContentsForSkilNoteId = (skilNoteId: any) => {

    const { isLoading: isPending, error, data } =
        useQuery<responseTypeForGetSkilNoteContents>({
            queryKey: ['apiForGetSkilNoteContentListForSkilNoteId', skilNoteId],
            queryFn: apiForGetSkilNoteContentListForSkilNoteId,
        });
    return { isPending, error, data };
};

export default useApiForGetSkilNoteContentsForSkilNoteId;
