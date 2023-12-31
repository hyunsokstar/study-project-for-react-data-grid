import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import { Box, Button } from '@chakra-ui/react';
import DataGrid, { RenderCheckboxProps, RowsChangeData, SelectColumn, textEditor } from 'react-data-grid';
import { CellExpanderFormatter } from '../Test/ReactDataGrid/CellExpanderFormatter';
import useGetAllTechNoteList from '@/hooks/useGetAllTechNoteList';
import { SelectColumnForReactDataGrid } from '@/components/Formatter/CheckBox/SelectColumnForRdg';
import CommonTextEditor from '@/components/GridEditor/TextEditor/CommonTextEditor';
import useSaveTodoRowsMutation from '@/hooks/useSaveTodoRowsMutation';
import useSaveTechNotesMutation from '@/hooks/useSaveTechNotesMutation';
import CommonSelectBoxEdtior from '@/components/GridEditor/SelectBox/CommonSelectBoxEdtior';
import SelectBoxForUserEmail from '@/components/GridEditor/SelectBox/SelectBoxForUserEmail';
import useUser from '@/hooks/useUser';

const PlanNoteList = () => {
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());
    const [noteRows, setNoteRows] = useState<TechNote[] | any>();
    const { isLoggedIn, loginUser, logout } = useUser();

    const columns = [
        SelectColumnForReactDataGrid,
        {
            key: 'expanded',
            name: '',
            minWidth: 30,
            width: 30,
            colSpan(args: any) {
                return args.type === 'ROW' && args.row.type === 'DETAIL' ? 7 : undefined;
            },
            renderCell({ row, tabIndex, onRowChange }: any): React.ReactNode {
                if (row.type === 'DETAIL') {
                    return <SubNoteGridTable parentId={row.parentId} />;
                }

                return (
                    <CellExpanderFormatter
                        expanded={row.expanded}
                        tabIndex={tabIndex}
                        onCellExpand={() => {
                            onRowChange({ ...row, expanded: !row.expanded });
                        }}
                    />
                );
            }
        },
        { key: 'id', name: 'ID' }, // Column에 id 추가
        {
            key: 'writer',
            name: 'Writer',
            // renderCell({ row, tabIndex, onRowChange }: any): React.ReactNode {

            //     return (
            //         <Box>{row.writer.email}</Box>
            //     );
            // },
            renderEditCell: SelectBoxForUserEmail
        },
        {
            key: 'title',
            name: 'Title',
            renderEditCell: CommonTextEditor
        },
        {
            key: 'description',
            name: 'Description',
            renderEditCell: CommonTextEditor,
        },
        {
            key: 'category',
            name: 'Category',
            renderEditCell: CommonTextEditor
        },
        { key: 'createdAt', name: 'Created At' },
    ];
    const [pageNum, setPageNum] = useState(1);

    // useQuery
    const { isLoading, error, data: dataForTechNoteList } = useGetAllTechNoteList(pageNum);
    console.log("dataForTechNoteList : ", dataForTechNoteList);

    // mutation
    const mutationForSaveTodoRows = useSaveTechNotesMutation();

    function onRowsChange(rows: TechNote[], { indexes, column }: any) {
        // console.log("indexes : ", indexes);

        const row = rows[indexes[0]];
        if (row.type === 'MASTER') {
            console.log("here 1?");

            if (row.expanded) {
                console.log("here2 ? ");
                rows.splice(indexes[0] + 1, 0, {
                    type: 'DETAIL',
                    id: row.id + 100,
                    parentId: row.id
                });
            } else {
                console.log("here ?");

                if (column.key === "expanded")
                    rows.splice(indexes[0] + 1, 1);
            }
        }
        setNoteRows(rows);
    }

    const addRowHandler = () => {
        console.log("addRowHandler");
        // addrowhandler 는 뭔가?
        // 목표

        const newRow = {
            id: 999999,
            title: '12',
            description: '',
            category: '',
            writer: loginUser.email ? loginUser.email : ""
        }

        setNoteRows((prev: TechNote[]) => [...prev, newRow])
    }

    const saveHandler = () => {
        if (selectedRows.size === 0 || !noteRows) {
            return;
        }

        const selectedNotes = Array.from(selectedRows).map((selectedId) =>
            noteRows.find((note: TechNote) => note.id === selectedId)
        );

        console.log('Selected Notes:', selectedNotes);
        mutationForSaveTodoRows.mutate(selectedNotes);
    };


    useEffect(() => {
        if (!isLoading) {
            const rowsToUpdate = dataForTechNoteList?.techNoteList.map((row: any) => {
                return {
                    id: row.id,
                    writer: row.writer ? row.writer.email : "",
                    title: row.title,
                    description: row.description,
                    category: row.category,
                    createdAt: row.createdAt,
                    type: "MASTER",
                    expanded: false,
                }
            })
            setNoteRows(rowsToUpdate);
        }
    }, [dataForTechNoteList])



    // 2244
    return (
        <Box width={"98%"} m={"auto"}>
            <Box display={"flex"} justifyContent={"flex-end"} my={2} gap={2}>
                <Button onClick={saveHandler} variant={"outline"}>save</Button>
                {isLoggedIn ?
                    <Button onClick={addRowHandler} variant={"outline"}>add</Button>
                    : ""}
            </Box>

            <DataGrid
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={noteRows ? noteRows : []}
                renderers={{ renderCheckbox }}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                onRowsChange={onRowsChange}
            />
        </Box>
    );
};

function renderCheckbox({ onChange, ...props }: RenderCheckboxProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
    }
    return <input type="checkbox" {...props} onChange={handleChange} />;
}

export default PlanNoteList;


const SubNoteGridTable = ({ parentId }: any) => {
    return (
        <Box>SubNoteGridTable</Box>
    )
}
