import { list } from "postcss";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import "./App.css";

interface ListItem {
  id: string;
  display: string;
}

const initial = Array.from({ length: 10 }, (v, k) => k).map((k) => {
  const custom: ListItem = {
    id: `id-${k}`,
    display: `Item ${k}`,
  };

  return custom;
});

const ListItemDisplay: React.FC<{ listItem: ListItem; index: number }> = ({
  listItem,
  index,
}) => {
  return (
    <Draggable draggableId={listItem.id} index={index}>
      {(provided) => (
        <div
          className="ListItemDisplay bg-purple-200"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span>{listItem.display}</span>
        </div>
      )}
    </Draggable>
  );
};

const ListItemsDisplay: React.FC<{ list: ListItem[] }> = ({ list }) => {
  const listItems = list.map((listItem: ListItem, index: number) => {
    return (
      <ListItemDisplay listItem={listItem} index={index} key={listItem.id} />
    );
  });
  return <div>{listItems}</div>;
};

const reorder = (list: ListItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list); // copy the array
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: ListItem[],
  destination: ListItem[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
): Record<string, ListItem[]> => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };
};

const DroppableList: React.FC<{ listId: string; items: ListItem[] }> = ({
  listId,
  items,
}) => {
  return (
    <Droppable droppableId={listId}>
      {(provided) => (
        <div
          className="bg-green-500 pr-2"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <ListItemsDisplay list={items} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<Record<string, ListItem[]>>({
    list1: initial,
    list2: [],
  });
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const reorderResult = reorder(
        state[source.droppableId],
        source.index,
        destination.index
      );
      setState({ [source.droppableId]: reorderResult, ...state });
    } else {
      setState(
        move(
          state[source.droppableId],
          state[destination.droppableId],
          source,
          destination
        )
      );
    }
  };

  return (
    <body>
      <div className="App">
        <DragDropContext onDragEnd={onDragEnd}>
          <DroppableList listId="1" items={state.list1}></DroppableList>
          <DroppableList listId="2" items={state.list2}></DroppableList>
        </DragDropContext>
      </div>
    </body>
  );
};

export default App;
