import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
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

const ListItemDisplay: React.FC<{ listItem: ListItem }> = ({ listItem }) => {
  return (
    <div className="ListItemDisplay" id={listItem.id}>
      <span>{listItem.display}</span>
    </div>
  );
};

const List: React.FC<{ list: ListItem[] }> = ({ list }) => {
  const listItems = list.map((listItem: ListItem, index: number) => {
    return <ListItemDisplay listItem={listItem} key={listItem.id} />;
  });
  return <div>{listItems}</div>;
};

const reorder = (list: ListItem[], startIndex: number, endIndex: number) => {
  const result = Array.from(list); // copy the array
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const App: React.FC = () => {
  const [state, setState] = useState({ list: initial });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    } else if (result.destination.index === result.source.index) {
      return;
    } else {
      setState({
        list: reorder(
          state.list,
          result.source.index,
          result.destination.index
        ),
      });
    }
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <List list={initial} />
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
