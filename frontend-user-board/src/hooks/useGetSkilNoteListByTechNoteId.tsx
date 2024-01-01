import { apiForGetSkillNotesByTechNoteId } from '@/api/apiForSkilNote';
import { SkillNoteListResponse } from '@/types/typeForSkilNote';
import { Box } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import React from 'react'


type IProps = {
    techNoteId: any;
    pageNum: number;
}

const useApiForGetSkilNoteListByTechNoteId = ({ techNoteId, pageNum }: IProps) => {

    const { isLoading, error, data } = useQuery<SkillNoteListResponse>({
        queryKey: ['apiForGetAllTodoList', techNoteId, pageNum],
        queryFn: () => apiForGetSkillNotesByTechNoteId(techNoteId, pageNum),
    });

    return { isLoading, error, data }
}

export default useApiForGetSkilNoteListByTechNoteId