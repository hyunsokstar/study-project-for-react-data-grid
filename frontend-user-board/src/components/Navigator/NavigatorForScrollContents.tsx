import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import {
    DragDropContext,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import useApiForUpdateOrderForSkilNoteContents from "@/hooks/useApiForUpdateOrderForSkilNoteContents";

const Droppable = dynamic(
    () => import("react-beautiful-dnd").then((res) => res.Droppable),
    { ssr: false }
);

type Item = {
    id: string;
    order: string;
};

// const getItems = (count: number): Item[] =>
//     Array.from({ length: count }, (v, k) => k).map((k) => ({
//         id: `${k + 1}`,
//         order: `${k + 1}`,
//     }));

const getItems = (count: number): Item[] =>
    Array.from({ length: count }, (v, k) => ({
        id: `${k + 1}`,
        order: `${k + 1} (${v})`,
    }));

const reorder = (
    list: Item[],
    startIndex: number,
    endIndex: number
): Item[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const grid = 8;

const getItemStyle = (
    draggableStyle: any,
    isDragging: boolean,
): React.CSSProperties => ({
    userSelect: "none",
    padding: grid * 2,
    marginBottom: grid,
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 100,
});

interface IProps {
    itemsInfo: Item[]
    skilNoteId: any
    pageNum: any
    scrollToCard: (index: number) => void
    checkedRows: number[];
    setCheckedRows: any;
    scrollCardToEditor: () => void
}

const NavigatorForScrollContents =
    ({ itemsInfo, skilNoteId, pageNum, scrollToCard, scrollCardToEditor, checkedRows, setCheckedRows }: IProps) => {
        const [items, setItems] = useState<Item[]>(itemsInfo);
        const mutationForUpdateOrderForSkilNoteContents = useApiForUpdateOrderForSkilNoteContents(skilNoteId, pageNum);

        const editorRef = useRef<HTMLDivElement>(null);

        // console.log("itemsInfo : ", itemsInfo);
        // console.log("scrollToCard : ", scrollToCard);

        const onDragEnd = (result: DropResult) => {
            console.log("옮긴 박스의 order number : ", result.draggableId);
            console.log("도착지의 oreder number ", result.destination && result.destination.index + 1);

            if (!result.destination) {
                return;
            }

            const newItems = reorder(
                items,
                result.source.index,
                result.destination.index
            );
            setItems(newItems);

            mutationForUpdateOrderForSkilNoteContents.mutate(newItems)
        };

        useEffect(() => {
            if (itemsInfo) {
                setItems(itemsInfo)
            }
        }, [itemsInfo])

        // console.log("items : ", items);

        const contentOrderButtonHandler = (e: any, orderNum: string, contentId: string) => {
            console.log("contentOrderButtonHandler");
            scrollToCard(parseInt(orderNum))
            const skilnoteContentId = parseInt(contentId)

            // todo shift + click 일 경우 아래 checkedRows 관련 if else 실행 되도록 조건 수정 
            const isShiftKeyPressed = e.shiftKey;

            if (isShiftKeyPressed) {
                console.log("check excute ");
                if (checkedRows.includes(skilnoteContentId)) {
                    const updatedRows = checkedRows.filter(id => id !== skilnoteContentId);
                    setCheckedRows(updatedRows); // contentId를 제거한 배열로 상태 업데이트

                } else {
                    const updatedRows = [...checkedRows, skilnoteContentId];
                    setCheckedRows(updatedRows); // contentId를 추가한 배열로 상태 업데이트
                }
            }

        }

        return (
            <Box>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <Box
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {items && items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <Box>
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        provided.draggableProps.style,
                                                        snapshot.isDragging
                                                    )}
                                                    // onClick={() => scrollToCard(parseInt(item.order))}
                                                    onClick={(e) => contentOrderButtonHandler(e, item.order, item.id)}
                                                    fontSize={14}
                                                    border={checkedRows.includes(parseInt(item.id)) ? "1px solid red" : "1px solid black"}
                                                >
                                                    {index + 1} ({item.id})
                                                </Box>
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                <Box>
                                    <Button background={"green.100"} variant={"outline"} onClick={scrollCardToEditor}>create</Button>
                                </Box>
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>
        );
    };

export default NavigatorForScrollContents;
