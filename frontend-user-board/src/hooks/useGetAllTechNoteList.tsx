import React from 'react'
import { apiForGetAllTechNoteList } from '@/api/apiForTechNotes'
import { useQuery } from '@tanstack/react-query'

type Props = {}

const useGetAllTechNoteList = (pageNum: number) => {
    const { isLoading, error, data } = useQuery<ResponseDataTypeForGetAllTechNoteList>({
        queryKey: ['apiForGetAllTechNoteList', pageNum],
        queryFn: apiForGetAllTechNoteList
    })

    return { isLoading, error, data };
}

export default useGetAllTechNoteList