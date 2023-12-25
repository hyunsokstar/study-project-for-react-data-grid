import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { useRowSelection } from 'react-data-grid';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface EditorProps {
    row: any;
    column: { key: keyof any };
    onRowChange: (updatedRow: any) => void;
    onClose: (commitChanges?: boolean, shouldFocusCell?: boolean) => void;
}

function TestDateTimePicker({
    row,
    column,
    onRowChange,
    onClose,
}: EditorProps) {
    const [value, onChange] = useState<Value>(new Date());

    const [isRowSelected, onRowSelectionChange] = useRowSelection();
    const [initialValue, setInitialValue] = useState(row[column.key]);

    const onChangeHandler = (e: any) => {
        console.log("e : ", e);
    }

    const onBlurHandler = (e: any) => {
        console.log("e : ", e);
    }


    return (
        <Box width={"80%"} m={"auto"} mt={5}>
            <DateTimePicker onBlur={onBlurHandler} onChange={onChangeHandler} value={value} />
        </Box>
    );
}

export default TestDateTimePicker