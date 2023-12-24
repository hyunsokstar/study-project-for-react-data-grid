import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import DataGrid, { RenderCheckboxProps, RenderSortStatusProps } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import useGetAllTodos from '@/hooks/useGetAllTodos';
import { ITypeForTodoRow } from '@/types/typeforTodos';
import { SelectColumnForReactDataGrid } from '@/components/Formatter/CheckBox/SelectColumnForRdg';

type Props = {};

const columns = [
    // step3 select column 설정 하기
    SelectColumnForReactDataGrid,
    { key: 'id', name: 'ID' },
    { key: 'email', name: 'Email' },
    { key: 'todo', name: 'ToDo' }
];

interface ITypeForGridRows {
    id: any,
    email: string;
    todo: string;
}


const TodosPageByReactDataGrid = (props: Props) => {
    const [pageNum, setPageNum] = useState(1);
    const { isLoading, error, dataForTodos } = useGetAllTodos(pageNum);
    const [todoRows, setTodoRows] = useState<ITypeForGridRows[]>();

    // step1 체크 박스 관련 state 선언 추가
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());

    useEffect(() => {
        let todoRowsToShow;
        if (dataForTodos && dataForTodos.todoList.length > 0) {
            todoRowsToShow = dataForTodos.todoList.map((row: ITypeForTodoRow) => {
                return {
                    id: row.id,
                    email: row.manager.nickname,
                    todo: row.task
                }
            })
        }
        setTodoRows(todoRowsToShow)
    }, [dataForTodos])


    return (
        <Box width={"80%"} margin={"auto"} mt={3}>
            <DataGrid
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={todoRows ? todoRows : []}
                // step2 selected 이벤트에 대한 property 설정 + checkedRows log 로 확인
                selectedRows={selectedRows}
                onSelectedRowsChange={(selected) => {
                    const selectedRowIds = Array.from(selected.values());
                    console.log("체크된 번호들: ", selectedRowIds);
                    setSelectedRows(selected);
                }}
                // step4 rederers 를 그냥 붙여 
                // 뭔소리인지 모르겠는데 두번째가 checkbox custom 임
                renderers={{ renderSortStatus, renderCheckbox }}
            />;
        </Box>
    );
};

// step4 관련 코드
function renderCheckbox({ onChange, ...props }: RenderCheckboxProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
    }
    return <input type="checkbox" {...props} onChange={handleChange} />;
}

function renderSortStatus({ sortDirection, priority }: RenderSortStatusProps) {
    return (
        <>
            {sortDirection !== undefined ? (sortDirection === 'ASC' ? '\u2B9D' : '\u2B9F') : null}
            <span>{priority}</span>
        </>
    );
}

export default TodosPageByReactDataGrid;
