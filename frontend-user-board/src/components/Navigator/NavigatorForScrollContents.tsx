import React, { useEffect, useState } from "react";
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

const getItems = (count: number): Item[] =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `${k + 1}`,
        order: `${k + 1}`,
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
    isDragging: boolean
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
    width: 80,
});

interface IProps {
    itemsInfo: Item[]
    skilNoteId: any
    pageNum: any
}

const NavigatorForScrollContents = ({ itemsInfo, skilNoteId, pageNum }: IProps) => {
    const [items, setItems] = useState<Item[]>(itemsInfo);
    const mutationForCreateSkilNoteContent = useApiForUpdateOrderForSkilNoteContents(skilNoteId, pageNum); // 훅 사용

    console.log("itemsInfo : ", itemsInfo);


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

        mutationForCreateSkilNoteContent.mutate(newItems)
    };

    useEffect(() => {
        if (itemsInfo) {
            setItems(itemsInfo)
        }
    }, [itemsInfo])

    console.log("items : ", items);


    return (
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
                                    <div>
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                provided.draggableProps.style,
                                                snapshot.isDragging
                                            )}
                                            onClick={() => alert(item.id)}
                                        >
                                            {/* {item.order} */}
                                            {index + 1}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default NavigatorForScrollContents;
