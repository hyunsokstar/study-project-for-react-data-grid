import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForUpdateSkilNoteContent } from '@/api/apiForSkilNote';

const useApiForUpdateSkilNoteContent = (skilNoteId: any, pageNum: number) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutationForCreateSkilNoteContent = useMutation({
        mutationFn: apiForUpdateSkilNoteContent,
        onSuccess: (result: any) => {
            queryClient.refetchQueries({
                queryKey: ['apiForGetSkilNoteContentListForSkilNoteId', skilNoteId, pageNum]
            });

            toast({
                title: "update skilnote content success",
                description: result.message,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        },
        onError: (error: any) => {
            console.log("error : ", error);

            toast({
                title: error.response.data.error,
                description: error.response.data.message,
                status: "error",
                duration: 2000,
                isClosable: true,
            });

        },
    });

    return mutationForCreateSkilNoteContent;
};

export default useApiForUpdateSkilNoteContent