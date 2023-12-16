import React, { useState, useEffect, useContext, createContext } from 'react';
import { Box } from '@chakra-ui/react';
import DataGrid, { RenderHeaderCellProps } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import useApiForGetAllUsersData from '@/hooks/useApiForGetAllUsersData';
import { Row } from '@/types/typeForUserBoard';

const FilterContext = createContext<Filter | undefined>(undefined);
interface IUserFilter extends Omit<Row, 'id' | 'complete'> {
    id: number;
    email: string;
    nickname: string;
    role: string;
    gender: string;
    phoneNumber: string;
    frontEndLevel: number;
    backEndLevel: number;
    enabled: boolean;
}


const HeaderFilter = () => {
    const [pageNum, setPageNum] = useState(1);
    const { isPending, error, userRows } = useApiForGetAllUsersData(pageNum);
    const [filters, setFilters] = useState(
        (): IUserFilter => ({
            id: 0,
            email: '',
            nickname: '',
            role: '',
            gender: '',
            phoneNumber: '',
            frontEndLevel: 1,
            backEndLevel: 1,
            enabled: true
        })
    );

    const columns = [
        { key: 'id', name: 'ID' },
        { key: 'email', name: 'Email' },
        // { key: 'nickname', name: 'Nickname' },

        {
            key: 'nickname',
            name: 'Nick Name',
            // headerCellClass: filterColumnClassName,
            renderHeaderCell: (p: any) => (
                <FilterRenderer<Row> {...p}>
                    {({ filters, ...rest }) => (
                        <input
                            {...rest}
                            // className={filterClassname}
                            value={filters.nickname}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    nickname: e.target.value
                                })
                            }
                        // onKeyDown={inputStopPropagation}
                        />
                    )}
                </FilterRenderer>
            )
        },

        { key: 'role', name: 'Role' },
        { key: 'gender', name: 'Gender' },
        { key: 'backEndLevel', name: 'Backend Level' },
        { key: 'frontEndLevel', name: 'Frontend Level' }
    ];

    console.log("userRows from api : ", userRows);

    return (
        <Box width={"80%"} mt={3} mx={"auto"}>
            <FilterContext.Provider value={filters}>
                <DataGrid
                    columns={columns}
                    rows={userRows}
                    headerRowHeight={filters.enabled ? 70 : undefined}
                />
            </FilterContext.Provider>
        </Box>
    );
};

function FilterRenderer<R>({
    tabIndex,
    column,
    children
}: RenderHeaderCellProps<R> & {
    children: (args: { tabIndex: number; filters: IUserFilter }) => React.ReactElement;
}) {
    const filters = useContext(FilterContext)!;
    return (
        <>
            <div>{column.name}</div>
            {filters.enabled && <div>{children({ tabIndex, filters })}</div>}
        </>
    );
}

export default HeaderFilter;