import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Box, Button, Select } from '@chakra-ui/react';
import DataGrid, { Column, RenderCheckboxProps, RenderEditCellProps, RenderSortStatusProps, textEditor, useRowSelection } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import useGetAllTodos from '@/hooks/useGetAllTodos';
import { ITypeForTodoRow } from '@/types/typeforTodos';
import { SelectColumnForReactDataGrid } from '@/components/Formatter/CheckBox/SelectColumnForRdg';
import CommonSelectBoxEdtior from '@/components/GridEditor/SelectBox/CommonSelectBoxEdtior';
import { format } from 'date-fns';
import useSaveTodoRowsMutation from '@/hooks/useSaveTodoRowsMutation';
import CommonTextEditor from '@/components/GridEditor/TextEditor/CommonTextEditor';
import CommonDateTimePicker from '@/components/GridEditor/DateTimePicker/CommonDateTimePicker';

type Props = {};

const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), "yy-MM-dd HH:mm");
};

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
            // renderEditCell: CommonSelectBoxEdtior(usersEmailInfo)
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
            key: 'task',
            name: 'Task',
            width: 300,
            renderEditCell: CommonTextEditor
        },
        {
            key: 'status',
            name: "Status",
            renderEditCell: (props: {
                row: any;
                column: { key: keyof any };
                onRowChange: (updatedRow: any) => void;
                onClose: (commitChanges?: boolean, shouldFocusCell?: boolean) => void;
            }) => (
                <CommonSelectBoxEdtior
                    {...props}
                    arrayForSelectOption={["ready", "progress", "testing", "complete"]}
                />
            )
        },
        {
            key: 'startTime',
            name: 'startTime',
            renderCell(props: any) {
                console.log("props.row.startTime : ", props.row.startTime);

                if (props.row.startTime !== null && props.row.startTime !== "") {
                    const value = formatDateTime(props.row.startTime);
                    return (
                        <>
                            {value}
                        </>
                    );
                } else {
                    return ""
                }
            },
        },
        {
            key: 'deadline',
            name: 'deadline',
            width: 200,
            renderCell(props: any) {
                if (props.row.deadline !== null && props.row.deadline !== "") {
                    const value = formatDateTime(props.row.deadline);
                    return (
                        <>
                            {value}
                        </>
                    );
                } else {
                    return ""
                }
            },
            renderEditCell: CommonDateTimePicker
        }
    ];
}

interface ITypeForGridRows {
    id: any,
    email: string;
    task: string;
    status: string;
    startTime: string;
    deadline: string;
}

// 1122
const TodosPageByReactDataGrid = (props: Props) => {
    const [pageNum, setPageNum] = useState(1);
    const { isLoading, error, dataForTodos } = useGetAllTodos(pageNum);
    const [todoRows, setTodoRows] = useState<ITypeForGridRows[]>();
    const [usersEmailInfo, setUsersEmailInfo] = useState<string[]>([])
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());
    const [defaultUserEmail, setDefaultUserEmail] = useState(''); // 기본 사용자 이메일 상태 설정
    const columns = useMemo(() => getColumns(usersEmailInfo), [usersEmailInfo]);



    // mutation
    const mutationForSaveTodoRows = useSaveTodoRowsMutation();

    const handleAddRow = () => {
        const newId = todoRows?.length ? Math.max(...todoRows.map(row => row.id)) + 1 : 1;
        setTodoRows((prevRows: any) => {

            if (!prevRows) {
                return [
                    {
                        id: newId,
                        email: defaultUserEmail || '', // defaultUserEmail이 존재하면 해당 이메일, 없으면 빈 문자열
                        todo: 'todo for sample',
                        status: 'ready',
                        startTime: '',
                        deadline: ''
                    }
                ]
            } else {
                return [
                    ...prevRows,
                    {
                        id: newId,
                        email: defaultUserEmail || '', // defaultUserEmail이 존재하면 해당 이메일, 없으면 빈 문자열
                        todo: 'todo for sample',
                        status: 'ready',
                        startTime: '',
                        deadline: ''
                    }
                ]
            }

        });
    };

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setDefaultUserEmail(event.target.value); // 선택한 이메일로 defaultUserEmail 상태 업데이트
    };

    const handleSave = () => {
        const todoRowsForSave = todoRows?.filter(row => selectedRows.has(row.id)) || [];
        console.log('todoRowsForSave : ', todoRowsForSave);
        mutationForSaveTodoRows.mutate({ todoRowsForSave: todoRowsForSave });
        setSelectedRows(new Set())
    };

    useEffect(() => {
        let todoRowsToShow;

        if (dataForTodos) {
            setUsersEmailInfo(dataForTodos.usersEmailInfo)
        }


        if (dataForTodos && dataForTodos.todoList.length > 0) {
            todoRowsToShow = dataForTodos.todoList.map((row: ITypeForTodoRow) => {
                return {
                    id: row.id,
                    email: row.manager.email,
                    task: row.task,
                    status: row.status,
                    startTime: row.startTime, // 변환된 형태로 저장
                    deadline: row.deadline
                }
            })
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

                {/* {defaultUserEmail} */}
                <Box width={"20%"}>
                    {usersEmailInfo.length ? (
                        <Select
                            placeholder="Select default user"
                            value={defaultUserEmail} // 현재 defaultUserEmail 상태값으로 선택
                            onChange={handleSelectChange} // 선택 시 상태 업데이트
                        >
                            {usersEmailInfo.map((email, index) => (
                                <option key={index} value={email}>
                                    {email}
                                </option>
                            ))}
                        </Select>
                    ) : (
                        "No users"
                    )}
                </Box>

                <Box width={"100%"}>
                    {/* {usersEmailInfo.length ? usersEmailInfo.map((row) => {
                        return "hi"
                    }) : "no users"} */}

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