import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import DataGrid, { Column, RenderCheckboxProps, RenderEditCellProps, RenderSortStatusProps, textEditor, useRowSelection } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import useGetAllTodos from '@/hooks/useGetAllTodos';
import { ITypeForTodoRow } from '@/types/typeforTodos';
import { SelectColumnForReactDataGrid } from '@/components/Formatter/CheckBox/SelectColumnForRdg';
import CommonSelectBoxEdtior from '@/components/GridEditor/SelectBox/CommonSelectBoxEdtior';

type Props = {};

// 다음과 같이 에디터 설정 (with 공통 셀렉트 박스 에디터 만들기 )
function getColumns(
    usersEmailInfo: string[],
) {
    return [
        SelectColumnForReactDataGrid,
        { key: 'id', name: 'ID' },
        {
            key: 'email',
            name: 'Email',
            renderEditCell: (props: {
                row: any;
                column: { key: keyof any };
                onRowChange: (updatedRow: any) => void;
                onClose: (commitChanges?: boolean, shouldFocusCell?: boolean) => void;
            }) => (
                <CommonSelectBoxEdtior
                    {...props}
                    arrayForSelectOption={usersEmailInfo}
                />
            )
        },
        {
            key: 'todo',
            name: 'ToDo',
            renderEditCell: textEditor
        }
    ];
}

interface ITypeForGridRows {
    id: any,
    email: string;
    todo: string;
}

const TodosPageByReactDataGrid = (props: Props) => {
    const [pageNum, setPageNum] = useState(1);
    const { isLoading, error, dataForTodos } = useGetAllTodos(pageNum);
    const [todoRows, setTodoRows] = useState<ITypeForGridRows[]>();
    // 2244 유저 정보를 담을 state 변수 선언 (for select box option)
    const [usersEmailInfo, setUsersEmailInfo] = useState<string[]>([])
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());

    // 2244 column 를 함수로 설정 , 단 usersEmailInfo 가 바뀌지 않는한 다시 계산할 필요는 없으므로 useMemo를 적용
    const columns = useMemo(() => getColumns(usersEmailInfo), [usersEmailInfo]);

    const handleAddRow = () => {
        const newId = todoRows?.length ? Math.max(...todoRows.map(row => row.id)) + 1 : 1;
        setTodoRows((prevRows: any) => [
            ...prevRows,
            {
                id: newId,
                email: '',
                todo: 'todo for sample'
            }
        ]);
    };

    // 2244 save 함수에서 체크한 row 정보 출력 해보기
    const handleSave = () => {
        const selectedTodoRows = todoRows?.filter(row => selectedRows.has(row.id)) || [];
        console.log('Selected Todo Rows:', selectedTodoRows);
    };


    // 2244 유저 정보를 가져와서 set state
    useEffect(() => {
        let todoRowsToShow;
        if (dataForTodos && dataForTodos.todoList.length > 0) {
            todoRowsToShow = dataForTodos.todoList.map((row: ITypeForTodoRow) => {
                return {
                    id: row.id,
                    email: row.manager.email,
                    todo: row.task
                }
            })
            setUsersEmailInfo(dataForTodos.usersEmailInfo)
            setTodoRows(todoRowsToShow)
        }
    }, [dataForTodos])

    return (
        <Box width={"80%"} margin={"auto"} mt={3} gap={2}>

            <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Box display={"flex"} justifyContent={"flex-end"} gap={2} pr={2}>
                    <Button variant={"outline"} onClick={handleAddRow}>Add Row</Button>
                    {/* 2244 save 함수 구현 */}
                    <Button variant={"outline"} onClick={handleSave}>Save</Button>
                </Box>

                <Box width={"100%"}>

                    {usersEmailInfo ? usersEmailInfo.map((row) => row) : "no users"}

                    <DataGrid
                        rowKeyGetter={(row) => row.id}
                        columns={columns}
                        rows={todoRows || []}
                        selectedRows={selectedRows}
                        onSelectedRowsChange={(selected) => {
                            const selectedRowIds = Array.from(selected.values());
                            console.log("체크된 번호들: ", selectedRowIds);
                            setSelectedRows(selected);
                        }}
                        renderers={{ renderSortStatus, renderCheckbox }}
                        // 2244 셀 수정후 실행될 함수 설정
                        onRowsChange={setTodoRows}
                    />;
                </Box>
            </Box>

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
