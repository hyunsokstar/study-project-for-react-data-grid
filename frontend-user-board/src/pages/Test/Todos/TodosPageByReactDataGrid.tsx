import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Box, Button, Select } from '@chakra-ui/react';
import DataGrid, { Column, RenderCheckboxProps, RenderEditCellProps, RenderSortStatusProps, TreeDataGrid, textEditor, useRowSelection } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import useGetAllTodos from '@/hooks/useGetAllTodos';
import { ITypeForTodoRow } from '@/types/typeforTodos';
import { SelectColumnForReactDataGrid } from '@/components/Formatter/CheckBox/SelectColumnForRdg';
import CommonSelectBoxEdtior from '@/components/GridEditor/SelectBox/CommonSelectBoxEdtior';
import { format } from 'date-fns';
import useSaveTodoRowsMutation from '@/hooks/useSaveTodoRowsMutation';
import CommonTextEditor from '@/components/GridEditor/TextEditor/CommonTextEditor';
import CommonDateTimePicker from '@/components/GridEditor/DateTimePicker/CommonDateTimePicker';
import SelectBoxForNumberToAddRow from '@/components/Select/SelectBoxForNumberToAddRow';
import { groupBy as rowGrouper } from 'lodash-es';
import useApiForDeleteTodosForCheckedIds from '@/hooks/useApiForDeleteTodosForCheckedIds';
import BasicDateTimePicker from '@/components/DateTimePicker/BasicDateTimePicker';

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
        // {
        //     key: 'id',
        //     name: 'ID',
        //     width: 50
        // },
        {
            key: 'email',
            name: 'Email',
            width: 180,
            frozen: true,
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
            width: 500,
            renderEditCell: CommonTextEditor
        },
        {
            key: 'status',
            name: "Status",
            width: 200,

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
            width: 240,

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
            width: 240,
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
        },
        {
            key: 'elapsedTime',
            name: 'elapsedTime',
            width: 180,
        },
        // {
        //     key: 'briefing',
        //     name: 'briefing',
        //     width: 80,
        // }
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

// step5 옵션 추가
const options = [
    'email',
    'status',
] as const;

// 1122
const TodosPageByReactDataGrid = (props: Props) => {
    const [pageNum, setPageNum] = useState(1);
    const [todoRows, setTodoRows] = useState<ITypeForGridRows[]>();
    const [usersEmailInfo, setUsersEmailInfo] = useState<string[]>([])
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());

    const [defaultUserEmail, setDefaultUserEmail] = useState('');

    const [defaultDeadLine, setDefaultDeadline] = useState('');

    const [rowNumToAdd, setRowNumToAdd] = useState<number>(1);

    const { isLoading, error, dataForTodos } = useGetAllTodos(pageNum);
    const columns = useMemo(() => getColumns(usersEmailInfo), [usersEmailInfo]);

    // step1 group by 관련 state 선언 1
    const [selectedOptions, setSelectedOptions] = useState<readonly string[]>([
        // options[0],
        // options[1]
    ]);
    // step2 group by 관련 state 선언 2
    const [expandedGroupIds, setExpandedGroupIds] = useState(
        (): ReadonlySet<unknown> =>
            new Set<unknown>(['United States of America', 'United States of America__2015'])
    );

    const deleteForSkilNoteContentsForCheckedIdsMutation = useApiForDeleteTodosForCheckedIds(pageNum);

    // mutation
    const mutationForSaveTodoRows = useSaveTodoRowsMutation();

    const handleAddRow = () => {
        if (!todoRows) return;

        const newRows = Array.from({ length: rowNumToAdd }, (_, index) => {
            const newId = todoRows.length ? Math.max(...todoRows.map(row => row.id)) + index + 1 : index + 1;
            return {
                id: newId,
                email: defaultUserEmail || '',
                task: 'todo for sample',
                status: 'ready',
                startTime: '',
                deadline: defaultDeadLine || ''
            };
        });

        setTodoRows(prevRows => (prevRows ? [...prevRows, ...newRows] : newRows));
    };

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setDefaultUserEmail(event.target.value); // 선택한 이메일로 defaultUserEmail 상태 업데이트
    };

    const handleSave = () => {
        const todoRowsForSave = todoRows?.filter(row => selectedRows.has(row.id)) || [];
        console.log('todoRowsForSave : ', todoRowsForSave);
        mutationForSaveTodoRows.mutate({ todoRowsForSave });
        setSelectedRows(new Set())
    };

    // step6
    function toggleOption(option: string, enabled: boolean) {
        const index = selectedOptions.indexOf(option);
        if (enabled) {
            if (index === -1) {
                setSelectedOptions((options) => [...options, option]);
            }
        } else if (index !== -1) {
            setSelectedOptions((options) => {
                const newOptions = [...options];
                newOptions.splice(index, 1);
                return newOptions;
            });
        }
        setExpandedGroupIds(new Set());
    }

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
                    deadline: row.deadline,
                    elapsedTime: row.elapsedTime,
                }
            })
            setTodoRows(todoRowsToShow)
        }
    }, [dataForTodos])

    // const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());
    const deleteButtonHandler = () => {
        const selectedRowsArray = Array.from(selectedRows);
        const idsToDelete = selectedRowsArray.map(id => id);
        console.log("IDs to delete:", idsToDelete);
        deleteForSkilNoteContentsForCheckedIdsMutation.mutate(idsToDelete)
        setSelectedRows(new Set())
    };

    return (
        <Box width={"100%"} margin={"auto"} mt={3} gap={2} px={2}>

            <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Box display={"flex"} justifyContent={"flex-end"} gap={2}>

                    <Box width={"14%"}>
                        {usersEmailInfo.length ? (
                            <Select
                                placeholder="Select default user"
                                value={defaultUserEmail} // 현재 defaultUserEmail 상태값으로 선택
                                onChange={handleSelectChange} // 선택 시 상태 업데이트
                                size={"md"}
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

                    <Box
                        width={"14%"}
                        border={"0px solid green"}
                        textAlign={"center"}
                    // display="flex"
                    // alignItems="center"
                    >
                        {/* {defaultDeadLine} */}
                        <BasicDateTimePicker
                            defaultDeadLine={defaultDeadLine}
                            setDefaultDeadline={setDefaultDeadline}
                        />
                    </Box>

                    <Box>
                        {/* {rowNumToAdd} */}
                        <SelectBoxForNumberToAddRow rowNumToAdd={rowNumToAdd} setRowNumToAdd={setRowNumToAdd} />
                    </Box>
                    <Button variant={"outline"} onClick={handleAddRow}>Add Row</Button>
                    <Button variant={"outline"} onClick={handleSave}>Save</Button>
                    <Button variant={"outline"} onClick={deleteButtonHandler}>Delete ({selectedRows.size})</Button>
                </Box>

                <Box width={"100%"}>

                    {/* step4 group by 옵션 템플릿 추가 */}
                    <Box display={"flex"} gap="2" my={1} mt={2}>
                        <b>Group by:</b>
                        {options.map((option) => (
                            <label key={option}>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option)}
                                    onChange={(event) => toggleOption(option, event.target.checked)}
                                />{' '}
                                {option}
                            </label>
                        ))}
                    </Box>

                    <TreeDataGrid
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
                        onRowsChange={setTodoRows}
                        // step3 group by 속성 추가 
                        groupBy={selectedOptions}
                        rowGrouper={rowGrouper}
                        expandedGroupIds={expandedGroupIds}
                        onExpandedGroupIdsChange={setExpandedGroupIds}
                    // style={{ width: "100%" }}
                    />;
                </Box>
            </Box>

        </Box>
    );
};

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