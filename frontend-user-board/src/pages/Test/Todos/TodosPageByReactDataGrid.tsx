import React from 'react'
import { Box } from '@chakra-ui/react'
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

type Props = {}

const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
];

const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
];

const TodosPageByReactDataGrid = (props: Props) => {
    return (
        <Box width={"80%"} margin={"auto"} mt={3}>
            <DataGrid columns={columns} rows={rows} />;
        </Box>
    )
}

export default TodosPageByReactDataGrid