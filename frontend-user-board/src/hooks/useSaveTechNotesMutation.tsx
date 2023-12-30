import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiForSaveTechNotes } from '@/api/apiForTechNotes';

const useSaveTechNotesMutation = () => {
    const queryClient = useQueryClient();
    const toast = useToast(); // useToast 훅 사용

    const mutationForSaveTodoRows = useMutation({
        mutationFn: apiForSaveTechNotes,
        onSuccess: (result) => {

            queryClient.refetchQueries({
                queryKey: ['apiForGetAllTechNoteList']
            });

            toast({
                title: "save tech note success",
                description: result.message,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        },
    });

    return mutationForSaveTodoRows;
};

export default useSaveTechNotesMutation