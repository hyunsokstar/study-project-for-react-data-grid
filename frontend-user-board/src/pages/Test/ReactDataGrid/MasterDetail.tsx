import React, { useMemo, useRef, useState } from 'react'
import DataGrid, { Column, DataGridHandle, RowsChangeData } from 'react-data-grid';
import { CellExpanderFormatter } from './CellExpanderFormatter';
import { faker } from '@faker-js/faker';
import styles from './groupby.module.css';
import 'react-data-grid/lib/styles.css';
import { Box } from '@chakra-ui/react';

type Props = {}

const productsMap = new Map<number, readonly ProductRow[]>();

type DepartmentRow =
    | {
        type: 'MASTER';
        id: number;
        department: string;
        expanded: boolean;
    }
    | {
        type: 'DETAIL';
        id: number;
        parentId: number;
    };

interface ProductRow {
    id: number;
    product: string;
    description: string;
    price: string;
}

const productColumns: readonly Column<ProductRow>[] = [
    { key: 'id', name: 'ID', width: 35 },
    { key: 'product', name: 'Product' },
    { key: 'description', name: 'Description' },
    { key: 'price', name: 'Price' }
];

function getProducts(parentId: number): readonly ProductRow[] {
    // if (productsMap.has(parentId)) return productsMap.get(parentId)!;
    const products: ProductRow[] = [];
    for (let i = 0; i < 20; i++) {
        products.push({
            id: i,
            // product: faker.commerce.productName(),
            product: `product ${i}`,
            description: `description ${i}`,
            price: `price ${i}`
        });
    }
    // productsMap.set(parentId, products);
    return products;
}

function createDepartments(): readonly DepartmentRow[] {
    const departments: DepartmentRow[] = [];
    for (let i = 1; i < 30; i++) {
        departments.push({
            type: 'MASTER',
            id: i,
            department: `department ${i}`,
            expanded: false
        });
    }
    return departments;
}

// column 의 key 와 row 의 key 는 서로 매칭됨
const MasterDetail = (props: Props) => {

    const [rows, setRows] = useState(createDepartments);

    const columns = useMemo((): readonly Column<DepartmentRow>[] => {
        return [
            // point1
            // 첫번째 행, 확장과 닫힘에 대한 column flase 일때 > true 이면 아래 방향
            // 클릭하면 onRowChange 가 실행 되며 DETAIL 행이 MASTER 행 다음에 추가 됨 단 row.type 이 DETAIL (by point2)
            // row.type 에 따라 보이는 컴퍼넌트가 다름
            // css 는 cellClass
            {
                key: 'expanded',
                name: '',
                minWidth: 30,
                width: 30,
                colSpan(args) {
                    return args.type === 'ROW' && args.row.type === 'DETAIL' ? 3 : undefined;
                },
                cellClass(row) {
                    return row.type === 'DETAIL'
                        ? styles.expended_row
                        : "";
                },
                renderCell({ row, tabIndex, onRowChange }) {
                    if (row.type === 'DETAIL') {
                        // point2: 부모행 id를 아래와 같이 전달 가능
                        return <ProductGrid parentId={row.parentId} />;
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
            { key: 'id', name: 'ID', width: 35 },
            { key: 'department', name: 'Department' }
        ];
    }, []);

    // point2
    // 해당 행의 다음에 row 추가
    function onRowsChange(rows: DepartmentRow[], { indexes }: RowsChangeData<DepartmentRow>) {
        console.log("row change check");
        const row = rows[indexes[0]];
        if (row.type === 'MASTER') {
            if (row.expanded) {
                rows.splice(indexes[0] + 1, 0, {
                    type: 'DETAIL',
                    id: row.id + 100,
                    parentId: row.id
                });
            } else {
                rows.splice(indexes[0] + 1, 1);
            }
            setRows(rows);
        }
    }

    return (
        <Box width={"80%"} margin={"auto"}>
            <DataGrid
                rowKeyGetter={rowKeyGetter}
                columns={columns}
                rows={rows}
                onRowsChange={onRowsChange}
                headerRowHeight={45}
                rowHeight={(row) => (row.type === 'DETAIL' ? 300 : 45)}
                className="fill-grid"
                enableVirtualization={false}
                direction={"ltr"}
                onCellKeyDown={(_, event) => {
                    if (event.isDefaultPrevented()) {
                        event.preventGridDefault();
                    }
                }}
                style={{ width: "100%", margin: "auto" }}
            />
        </Box>
    )
}

export type Direction = 'ltr' | 'rtl';

// point3 확장행에 출력될 컴퍼넌트
function ProductGrid({ parentId }: { parentId: number; }) {
    const gridRef = useRef<DataGridHandle>(null);
    const products = getProducts(parentId);

    return (
        <Box mt={2}>
            <DataGrid
                ref={gridRef}
                rows={products}
                columns={productColumns}
                rowKeyGetter={rowKeyGetter}
                style={{ blockSize: 250 }}
            />
        </Box>
    );
}

function rowKeyGetter(row: DepartmentRow | ProductRow) {
    return row.id;
}

export default MasterDetail