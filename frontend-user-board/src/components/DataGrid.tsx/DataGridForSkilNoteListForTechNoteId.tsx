import { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";
import DataGrid, { RenderCheckboxProps, SelectColumn } from 'react-data-grid';
import useApiForGetSkilNoteListByTechNoteId from "@/hooks/useGetSkilNoteListByTechNoteId";
import { useRouter } from 'next/router';
import { CellExpanderFormatter } from "@/pages/Test/ReactDataGrid/CellExpanderFormatter";
import { SkillNoteRow } from "@/types/typeForSkilNote";
import { SelectColumnForReactDataGrid } from "../Formatter/CheckBox/SelectColumnForRdg";
import CommonTextEditor from "../GridEditor/TextEditor/CommonTextEditor";
import SelectBoxForUserEmail from "../GridEditor/SelectBox/SelectBoxForUserEmail";

interface IProps {
    techNoteId: any
}

const DataGridForSkilNoteListForTechNoteId = ({ techNoteId }: IProps) => {
    const router = useRouter();
    const [pageNum, setpageNum] = useState(1);
    const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set());

    const [skilnoteRows, setSkilNoteRows] = useState<SkillNoteRow[]>();

    const { isLoading, error, data: dataForSkilNotesByTechNoteId } = useApiForGetSkilNoteListByTechNoteId({
        techNoteId, // parentId 값을 techNoteId로 전달
        pageNum, // pageNum을 전달
    });

    console.log("selectedRows : ", selectedRows);
    // console.log("dataForSkilNotesByTechNoteId : ", dataForSkilNotesByTechNoteId);

    const detailHandler = (skilNoteId: any) => {
        // todo: /Notes/SkilNoteContents/{techNoteId} 로 페이지 라우팅
        router.push(`/Note/SkilNoteContents/${skilNoteId}`);
    }

    // step3 
    function onRowsChange(rows: SkillNoteRow[], { indexes, column }: any) {
        console.log("click ?? : ", rows);
        console.log("indexes : ", indexes);
        console.log("column : ", column);

        const row = rows[indexes[0]];
        if (row.type === 'MASTER') {
            console.log("here 1?");

            if (row.expanded) {
                console.log("here2 ? ");
                rows.splice(indexes[0] + 1, 0, {
                    type: 'DETAIL',
                    id: row.id + 100,
                });
            } else {
                console.log("here ?");

                if (column.key === "expanded")
                    rows.splice(indexes[0] + 1, 1);
            }
        }
        setSkilNoteRows(rows);
    }

    const columns = [
        SelectColumnForReactDataGrid,
        // step2 expanded 칼럼을 설정한뒤 클릭하면 row.expanded 가 toggle 되도록 설정
        {
            key: 'expanded',
            name: '',
            colSpan(args: any) {
                return args.type === 'ROW' && args.row.type === 'DETAIL' ? 7 : undefined;
            }, renderCell({ row, tabIndex, onRowChange }: any) {
                if (row.type === "DETAIL") {
                    return (
                        <Flex display="grid" gridTemplateColumns="1fr 1fr" lineHeight={"20px"} height={"96%"} mx={2} mt={2} gap={2}>
                            <Box border={"1px solid blue"}>Description</Box>
                            <Box border={"1px solid red"}>관련 게시판</Box>
                        </Flex>

                    )
                }
                else {
                    return (
                        <CellExpanderFormatter
                            expanded={row.expanded}
                            tabIndex={tabIndex}
                            onCellExpand={() => {
                                onRowChange({ ...row, expanded: !row.expanded });
                            }}
                        />
                    )
                }

            }
        },
        {
            key: 'email',
            name: 'Email',
            renderEditCell: SelectBoxForUserEmail
        },
        {
            key: 'title',
            name: 'Title',
            renderEditCell: CommonTextEditor
        },
        {
            key: 'description',
            name: 'description',
            renderEditCell: CommonTextEditor
        },
        {
            key: 'category',
            name: 'category',
            renderEditCell: CommonTextEditor
        },
        { key: 'createdAt', name: 'createdAt' },
        {
            key: 'detailButton',
            name: 'DetailButton',
            renderCell({ row, tabIndex, onRowChange }: any): React.ReactNode {
                return (
                    <Box>
                        <Button size={"sm"} variant={"outline"} onClick={() => detailHandler(row.id)}>detail</Button>
                    </Box>
                )
            }
        }
    ];

    useEffect(() => {
        // master detal step(1) 최초 type 과 expanded 를 설정에 추가
        if (dataForSkilNotesByTechNoteId && dataForSkilNotesByTechNoteId.skilNoteList.length > 0) {
            const initialSkilnoteRows = dataForSkilNotesByTechNoteId.skilNoteList.map((row) => {
                return {
                    id: row.id,
                    email: row.writer?.email,
                    title: row.title,
                    description: row.description,
                    category: row.category,
                    createdAt: row.createdAt,
                    writer: row.writer,
                    type: "MASTER",
                    expanded: false
                }
            })
            setSkilNoteRows(initialSkilnoteRows);
        }
    }, [dataForSkilNotesByTechNoteId])

    // function saveHandler(event: any): void {
    //     // todo: skilnoteRows 에서 selectedRows 에 담긴 id 에 해당하는 row 를 배열로 만든뒤 로그로 확인
    // }

    function saveHandler(event: React.MouseEvent<HTMLButtonElement>): void {
        const selectedRowsData = skilnoteRows?.filter(row => selectedRows.has(row.id));
        const selectedRowsIds = selectedRowsData?.map(row => row.id);
        console.log("Selected Rows IDs:", selectedRowsIds);
        console.log("selectedRowsData:", selectedRowsData);
    }

    return (
        <Box width={"96%"} pt={2} backgroundColor={"blue.50"}>
            {skilnoteRows && skilnoteRows.length > 0 ? (

                <Box display={"flex"} gap={2} justifyContent={"flex-end"} p={2}>
                    <Button variant={"outline"} size={"sm"}>delete</Button>
                    <Button variant={"outline"} size={"sm"}>add</Button>
                    <Button variant={"outline"} size={"sm"} onClick={saveHandler}>save</Button>
                </Box>
            ) : ""}
            {skilnoteRows && skilnoteRows.length > 0 ? (
                <DataGrid
                    columns={columns}
                    rows={skilnoteRows}
                    rowKeyGetter={(row) => row.id}
                    rowHeight={(row) => (row.type === 'DETAIL' ? 270 : 50)}
                    renderers={{ renderCheckbox }}
                    selectedRows={selectedRows}
                    onSelectedRowsChange={setSelectedRows}
                    onRowsChange={onRowsChange}
                    style={{ height: "50vh" }}
                />
            ) : "no data for Skil Note Rows"}
        </Box>);
};

function renderCheckbox({ onChange, ...props }: RenderCheckboxProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
    }
    return <input type="checkbox" {...props} onChange={handleChange} />;
}

export default DataGridForSkilNoteListForTechNoteId;