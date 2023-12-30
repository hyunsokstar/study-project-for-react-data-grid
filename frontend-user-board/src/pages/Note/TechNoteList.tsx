import React, { useEffect, useState } from 'react';
import 'react-data-grid/lib/styles.css';
import { Box } from '@chakra-ui/react';
import DataGrid, { RenderCheckboxProps, RowsChangeData, SelectColumn } from 'react-data-grid';
import { CellExpanderFormatter } from '../Test/ReactDataGrid/CellExpanderFormatter';
import useGetAllTechNoteList from '@/hooks/useGetAllTechNoteList';

// type Note = {
//     type: 'MASTER'
//     id: number; // id 추가
//     writer: string;
//     title: string;
//     description: string;
//     category: string;
//     createdAt: string;
//     expanded: boolean;
// } | {
//     type: 'DETAIL';
//     id: number;
//     parentId: number;
// };

// const fakeNotes: Note[] = [
//     {
//         type: 'MASTER',
//         id: 1, // 각 row에 id 추가
//         writer: 'John Doe',
//         title: 'Lorem Ipsum',
//         description: 'Lorem ipsum dolor sit amet',
//         category: 'plan',
//         createdAt: '2023-01-01',
//         expanded: false,
//     },
//     {
//         type: 'MASTER',
//         id: 2,
//         writer: 'Alice Smith',
//         title: 'Dolor Sit Amet',
//         description: 'Consectetur adipiscing elit',
//         category: 'report',
//         createdAt: '2023-02-15',
//         expanded: false,
//     },
//     {
//         type: 'MASTER',
//         id: 3,
//         writer: 'Bob Johnson',
//         title: 'Adipiscing Elit',
//         description: 'Sed do eiusmod tempor incididunt',
//         category: 'skil',
//         createdAt: '2023-03-20',
//         expanded: false,
//     },
//     {
//         type: 'MASTER',
//         id: 4,
//         writer: 'hyun',
//         title: 'nest js 14 tutorial',
//         description: 'Sed do eiusmod tempor incididunt',
//         category: 'tutorial',
//         createdAt: '2023-03-20',
//         expanded: false,
//     },
//     {
//         type: 'MASTER',
//         id: 5,
//         writer: 'hyun',
//         title: 'nest js 14 tutorial',
//         description: 'Sed do eiusmod tempor incididunt',
//         category: 'qna',
//         createdAt: '2023-03-20',
//         expanded: false,
//     },
// ];

const PlanNoteList = () => {
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());
    const [noteRows, setNoteRows] = useState<TechNote[]>([]);

    const columns = [
        SelectColumn,
        // step1 열리고 닫게만 해보자
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
                // return CellExpanderFormatter;
            }
        },
        { key: 'id', name: 'ID' }, // Column에 id 추가
        {
            key: 'writer',
            name: 'Writer',
            renderCell({ row, tabIndex, onRowChange }: any): React.ReactNode {

                return (
                    <Box>{row.writer.email}</Box>
                );
            }
        },
        { key: 'title', name: 'Title' },
        { key: 'description', name: 'Description' },
        { key: 'category', name: 'Category' },
        { key: 'createdAt', name: 'Created At' },
    ];
    const [pageNum, setPageNum] = useState(1);

    const { isLoading, error, data: dataForTechNoteList } = useGetAllTechNoteList(pageNum);
    console.log("dataForTechNoteList : ", dataForTechNoteList);


    function onRowsChange(rows: TechNote[], { indexes }: RowsChangeData<TechNote>) {
        console.log("rows : ", rows);
        console.log("indexes : ", indexes);

        // const row = rows[indexes[0]];
        // if (row.type === 'MASTER') {
        //     if (row.expanded) {
        //         rows.splice(indexes[0] + 1, 0, {
        //             type: 'DETAIL',
        //             id: row.id + 100,
        //             parentId: row.id
        //         });
        //     } else {
        //         rows.splice(indexes[0] + 1, 1);
        //     }
        // }
        setNoteRows(rows);
    }

    // { key: 'id', name: 'ID' }, // Column에 id 추가
    // { key: 'writer', name: 'Writer' },
    // { key: 'title', name: 'Title' },
    // { key: 'description', name: 'Description' },
    // { key: 'category', name: 'Category' },
    // { key: 'createdAt', name: 'Created At' },

    useEffect(() => {
        if (dataForTechNoteList) {
            // setNoteRows(dataForTechNoteList?.techNoteList)

            const rowsToUpdate = dataForTechNoteList.techNoteList.map((row) => {
                return {
                    id: row.id,
                    writer: row.writer,
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
    }, [])

    return (
        <Box width={"98%"} m={"auto"}>
            <DataGrid
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={noteRows ? noteRows : []}
                renderers={{ renderCheckbox }}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}

                onRowsChange={onRowsChange}
            // rowHeight={(row) => (row.type === 'DETAIL' ? 300 : 45)}
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
