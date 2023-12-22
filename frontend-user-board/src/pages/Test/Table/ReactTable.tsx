import * as React from 'react'

import './index.css'

import {
    ColumnDef,
    RowData,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Box, Button } from '@chakra-ui/react'

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

const defaultData: Person[] = [
    {
        firstName: 'hyun',
        lastName: 'oh',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'smart',
        progress: 10,
    },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
    columnHelper.accessor('firstName', {
        // cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: info => info.column.id,
    }),
    columnHelper.accessor('age', {
        header: () => 'Age',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
        cell: ({ row, column }) => {
            return row.getValue(column.id)
        },
        footer: info => info.column.id,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('progress', {
        header: 'Profile Progress',
        footer: info => info.column.id,
    }),
]

const defaultColumn: Partial<ColumnDef<Person>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const initialValue = getValue()
        // We need to keep and update the state of the cell normally
        const [value, setValue] = React.useState(initialValue)

        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
            table.options.meta?.updateData(index, id, value)
        }

        // If the initialValue is changed external, sync it up with our state
        React.useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return (
            <input
                value={value as string}
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
                style={{ backgroundColor: "yellow" }}
            />
        )
    },
}

function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}

function ReactTable() {
    const [data, setData] = React.useState(() => [...defaultData])
    const rerender = React.useReducer(() => ({}), {})[1]
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [isEditing, setIsEditing] = React.useState(false);


    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setData(old =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            }
                        }
                        return row
                    })
                )
            },
        },
    })

    console.log("table.getHeaderGroups()[0] : ", table.getHeaderGroups()[0]);


    return (
        <Box width={"80%"} mx={"auto"} mt={3}>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                            <th>
                                수정/삭제
                            </th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
                                    {flexRender(
                                        isEditing // isEditing 상태에 따라 cell의 포맷을 변경
                                            ? cell.column.columnDef.cell // 수정 가능한 포맷
                                            : info => info.getValue() // 수정 불가능한 포맷
                                        , cell.getContext())}
                                </td>
                            ))}
                            <td>
                                {!isEditing ?
                                    (
                                        <>
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                ml={2}
                                                onClick={() => {
                                                    setIsEditing(true)
                                                }}
                                            >
                                                수정
                                            </Button>
                                            {/* <Button size={"sm"} variant={"outline"} ml={2}
                                                onClick={() => {
                                                    setIsEditing(false)
                                                }}
                                            >
                                                취소
                                            </Button> */}
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                ml={2}
                                                onClick={() => {
                                                    setIsEditing(false)
                                                }}
                                            >
                                                저장
                                            </Button>
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                ml={2}
                                                onClick={() => {
                                                    setIsEditing(false)
                                                }}
                                            >취소</Button>
                                        </>
                                    )
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
            <div className="h-4" />
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
        </Box>
    )
}

export default ReactTable;
