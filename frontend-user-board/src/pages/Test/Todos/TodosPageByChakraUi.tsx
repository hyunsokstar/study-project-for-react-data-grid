import useGetAllTodos from '@/hooks/useGetAllTodos';
import { ITypeForTodoRow } from '@/types/typeforTodos';
import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'

type Props = {}


const TodosPageByChakraUi = (props: Props) => {
    const [pageNum, setPageNum] = useState(1);
    const { isLoading, error, dataForTodos } = useGetAllTodos(pageNum);
    console.log("dataForTodos : ", dataForTodos);

    return (
        <Box width={"80%"} margin={"auto"} mt={3}>
            {
                dataForTodos && dataForTodos?.todoList.length > 0 ?
                    dataForTodos.todoList.map((row: ITypeForTodoRow) => {
                        return (
                            <Box display={"flex"} gap={2}>
                                <Box>{row.id}</Box>
                                <Box>{row.manager.nickname}</Box>
                                <Box>{row.task}</Box>
                                <Box>{row.details}</Box>
                                <Box>{row.status}</Box>
                            </Box>
                        )
                    }) : "no data"
            }
        </Box>
    )
}

export default TodosPageByChakraUi