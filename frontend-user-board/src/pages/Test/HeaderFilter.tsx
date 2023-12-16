import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import useApiForGetAllUsersData from '@/hooks/useApiForGetAllUsersData';

const columns = [
    { key: 'id', name: 'ID' },
    { key: 'email', name: 'Email' },
    { key: 'nickname', name: 'Nickname' },
    { key: 'role', name: 'Role' },
    { key: 'gender', name: 'Gender' },
    { key: 'backEndLevel', name: 'Backend Level' },
    { key: 'frontEndLevel', name: 'Frontend Level' }
];

const HeaderFilter = () => {
    const [pageNum, setPageNum] = useState(1);
    const { isPending, error, userRows } = useApiForGetAllUsersData(pageNum);

    console.log("userRows from api : ", userRows);


    return (
        <Box width={"80%"} mt={3} mx={"auto"}>
            <DataGrid columns={columns} rows={userRows} />
        </Box>
    );
};

export default HeaderFilter;