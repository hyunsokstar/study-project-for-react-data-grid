import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { apiForDeleteTodosForCheckedRows } from '@/api/apiForTodos';

type Props = {}

const useApiForDeleteTodosForCheckedIds = (pageNum: any) => {
    const queryClient = useQueryClient();
    const toast = useToast(); // useToast 훅 사용

    const mutation = useMutation({
        mutationFn: apiForDeleteTodosForCheckedRows,
        onSuccess: (result) => {
            console.log("result : ", result);

            queryClient.refetchQueries({
                queryKey: ['apiForGetAllTodoList', pageNum]
            });

            toast({
                title: "delete todos for checked ids success",
                description: result.message,
                status: "success",
                duration: 2000, // 토스트 메시지가 보여지는 시간 (2초)
                isClosable: true, // 닫기 버튼 표시
            });
        },
        onError: (error: any) => {

            const message = error.response.data.message

            toast({
                title: "error occured when delete todos",
                description: message,
                status: "error",
                duration: 2000, // 토스트 메시지가 보여지는 시간 (2초)
                isClosable: true, // 닫기 버튼 표시
            });

        },
    });

    return mutation;
}

export default useApiForDeleteTodosForCheckedIds