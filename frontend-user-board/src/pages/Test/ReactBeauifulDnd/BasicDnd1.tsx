import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type Item = {
  id: string;
  content: string;
};

const getItems = (count: number): Item[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k + 1}`,
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
  width: 250,
});

const BasicDnd1: React.FC = () => {
  const [items, setItems] = useState<Item[]>(getItems(10));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {items.map((item, index) => (
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {(provided, snapshot) => (
            <Box>
              <Button
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps} // 드래그 핸들 props
                style={getItemStyle(
                  provided.draggableProps.style,
                  snapshot.isDragging
                )}
                border={"2px solid red"}
              >
                {item.content}
              </Button>
            </Box>
          )}
        </Draggable>
      ))}
    </DragDropContext>
  );
};

export default BasicDnd1;
