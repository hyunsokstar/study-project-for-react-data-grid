import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { Box, Input } from '@chakra-ui/react';
import DataGrid, { RenderHeaderCellProps } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import useApiForGetAllUsersData from '@/hooks/useApiForGetAllUsersData';
import { Row } from '@/types/typeForUserBoard';
import styles from "./styles.module.scss"

interface Filter extends Omit<Row, 'id' | 'complete'> {
    complete: number | undefined;
    enabled: boolean;
}

const FilterContext = createContext<IUserFilter | undefined>(undefined);
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

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.stopPropagation();
    }
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
            width: 160,
            minWidth: 160,
            maxWidth: 35,
            resizable: false,
            sortable: false,

            renderHeaderCell: (p: any) => (
                <FilterRenderer<Row> {...p}>
                    {({ filters, ...rest }) => (
                        <input
                            {...rest}
                            className={styles.filterInput}
                            value={filters.nickname}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    nickname: e.target.value
                                })
                            }
                            onKeyDown={inputStopPropagation}
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

    const filteredRows = useMemo(() => {
        return userRows.filter((r) => {
            return (
                // (filters.task ? r.task.includes(filters.task) : true) &&
                // (filters.priority !== 'All' ? r.priority === filters.priority : true) &&
                // (filters.issueType !== 'All' ? r.issueType === filters.issueType : true) &&
                // (filters.developer
                // ? r.developer.toLowerCase().startsWith(filters.developer.toLowerCase())
                // : true) &&
                (filters.nickname !== undefined ? r.nickname.includes(filters.nickname) : true)
            );
        });
    }, [userRows, filters]);

    return (
        <Box width={"80%"} mt={3} mx={"auto"}>
            <FilterContext.Provider value={filters}>
                <DataGrid
                    columns={columns}
                    rows={filteredRows}
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
    console.log("children : ", children);

    return (
        <Box >
            {/* <div>{column.name}</div> */}
            <Box>{children({ tabIndex, filters })}</Box>
        </Box>
    );
}

export default HeaderFilter;