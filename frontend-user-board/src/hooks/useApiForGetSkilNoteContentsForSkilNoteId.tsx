import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiForGetSkilNoteContentListForSkilNoteId } from '@/api/apiForSkilNote';
import { responseTypeForGetSkilNoteContents } from '@/types/typeForSkilNoteContents';

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


// type responseTypeForGetSkilNoteContents = {
//     title: string;
//     writer: Writer;
//     skilnoteContents: typeForSkilNoteContentRow[]
// };

const useApiForGetSkilNoteContentsForSkilNoteId = (skilNoteId: any, pageNum: any) => {

    const { isLoading: isPending, error, data } =
        useQuery<responseTypeForGetSkilNoteContents>({
            queryKey: ['apiForGetSkilNoteContentListForSkilNoteId', skilNoteId, pageNum],
            queryFn: apiForGetSkilNoteContentListForSkilNoteId,
        });
    return { isPending, error, data };
};

export default useApiForGetSkilNoteContentsForSkilNoteId;
