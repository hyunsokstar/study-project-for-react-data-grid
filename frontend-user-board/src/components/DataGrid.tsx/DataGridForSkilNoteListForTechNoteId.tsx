import { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import DataGrid from 'react-data-grid';
import useApiForGetSkilNoteListByTechNoteId from "@/hooks/useGetSkilNoteListByTechNoteId";
import { useRouter } from 'next/router';


interface RowsTypeForSkilNoteGrid {
    id: any;
    title: string;
    description: string;
    category: string;
    createdAt: string;
}

interface IProps {
    techNoteId: any
}

const DataGridForSkilNoteListForTechNoteId = ({ techNoteId }: IProps) => {
    const [pageNum, setpageNum] = useState(1);
    const [skilnoteRows, setSkilNoteRows] = useState<RowsTypeForSkilNoteGrid[]>([]);
    const router = useRouter();

    const { isLoading, error, data: dataForSkilNotesByTechNoteId } = useApiForGetSkilNoteListByTechNoteId({
        techNoteId, // parentId 값을 techNoteId로 전달
        pageNum, // pageNum을 전달
    });

    console.log("dataForSkilNotesByTechNoteId : ", dataForSkilNotesByTechNoteId);

    const detailHandler = () => {
        // todo: /Notes/SkilNoteContents/{techNoteId} 로 페이지 라우팅
        router.push(`/Note/SkilNoteContents/${techNoteId}`);
    }

    const columns = [
        { key: 'id', name: 'ID' },
        { key: 'title', name: 'Title' },
        { key: 'description', name: 'description' },
        { key: 'category', name: 'category' },
        { key: 'createdAt', name: 'createdAt' },
        {
            key: 'detailButton',
            name: 'DetailButton',
            renderCell({ row, tabIndex, onRowChange }: any): React.ReactNode {
                return (
                    <Box>
                        <Button size={"sm"} variant={"outline"} onClick={detailHandler}>detail</Button>
                    </Box>)
            }
        }
    ];

    useEffect(() => {
        if (dataForSkilNotesByTechNoteId && dataForSkilNotesByTechNoteId.skilNoteList.length > 0) {
            const initialSkilnoteRows = dataForSkilNotesByTechNoteId.skilNoteList.map((row) => {
                return {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    category: row.category,
                    createdAt: row.createdAt
                }
            })
            setSkilNoteRows(initialSkilnoteRows);
        }

    }, [dataForSkilNotesByTechNoteId])


    return (
        <Box width={"96%"} pt={2} backgroundColor={"blue.50"}>
            {skilnoteRows.length > 0 ? (
                <DataGrid columns={columns} rows={skilnoteRows} />
            ) : "no data for Skil Note Rows"}
        </Box>);
};

export default DataGridForSkilNoteListForTechNoteId;