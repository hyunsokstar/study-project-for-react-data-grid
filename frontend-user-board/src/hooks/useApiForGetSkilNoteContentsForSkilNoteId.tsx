import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ITypeForResponseDataForGetAllUsers, IUser } from '@/types/typeForUserBoard';
import { apiForGetSkilNoteContentListForSkilNoteId } from '@/api/apiForSkilNote';
import { SkilNoteContentsRow } from '@/types/typeForSkilNoteContents';

type SkilNoteContentsQueryResult = {
    isPending: boolean;
    error: any;
    data: SkilNoteContentsRow[];
};

const useApiForGetSkilNoteContentsForSkilNoteId = (skilNoteId: any) => {

    const { isLoading: isPending, error, data } =
        useQuery<SkilNoteContentsQueryResult>({
            queryKey: ['apiForGetSkilNoteContentListForSkilNoteId', skilNoteId],
            queryFn: apiForGetSkilNoteContentListForSkilNoteId,
        });
    return { isPending, error, data };
};

export default useApiForGetSkilNoteContentsForSkilNoteId;
