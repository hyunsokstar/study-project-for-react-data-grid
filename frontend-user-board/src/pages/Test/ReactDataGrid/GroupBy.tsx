import React from 'react';
import { Box } from '@chakra-ui/react';
import DataGrid, { Column } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

type Row = {
    id: number;
    title: string;
    email: string;
    status: string;
    priority: string;
    gender: string;
    month: string;
};

const columns: readonly Column<Row>[] = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' },
    { key: 'email', name: 'Email' },
    { key: 'status', name: 'Status' },
    { key: 'priority', name: 'Priority' },
    { key: 'gender', name: 'Gender' },
    { key: 'month', name: 'Month' },
];

const generateRows = (): Row[] => {
    const rows: Row[] = [];
    const titles = ['Example', 'Demo']; // For repeating titles
    const emails = ['test@example.com', 'user@example.com', 'another@example.com']; // Sample emails
    const priorities = ['1', '2', '3', '4', '5']; // Priorities
    const statuses = ['ready', 'progress', 'testing', 'complete']; // Statuses

    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(0, i);
        return date.toLocaleString('default', { month: 'long' });
    });

    for (let i = 0; i < 20; i++) {
        rows.push({
            id: i,
            title: titles[i % titles.length],
            email: emails[i % emails.length],
            status: statuses[i % statuses.length],
            priority: priorities[i % priorities.length],
            gender: i % 2 === 0 ? 'Male' : 'Female',
            month: months[i % priorities.length],
        });
    }

    return rows;
};



const GroupBy = () => {
    const rows = generateRows();

    return (
        <Box width="80%" m="auto" mt={5}>
            <DataGrid columns={columns} rows={rows} style={{ height: "60vh" }} />
        </Box>
    );
};

export default GroupBy;
