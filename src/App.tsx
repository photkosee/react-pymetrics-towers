import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Item {
  id: string;
  content: string;
}

interface ItemsArray {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const initialItems: Item[] = [
  { id: 'item-1', content: 'Item 1' },
  { id: 'item-2', content: 'Item 2' },
  { id: 'item-3', content: 'Item 3' },
  { id: 'item-4', content: 'Item 4' },
  { id: 'item-5', content: 'Item 5' },
];

const Example: React.FC = () => {
  const [countStep, setCountStep] = useState<number>(0);
  const [firstColumn, setFirstColumn] = useState<Item[]>([]);
  const [secondColumn, setSecondColumn] = useState<Item[]>([]);
  const [thirdColumn, setThirdColumn] = useState<Item[]>([]);
  const [firstSolution, setFirstSolution] = useState<Item[]>([]);
  const [secondSolution, setSecondSolution] = useState<Item[]>([]);
  const [thirdSolution, setThirdSolution] = useState<Item[]>([]);
  const allSolution: ItemsArray[] = [
    { items: firstSolution, setItems: setFirstSolution },
    { items: secondSolution, setItems: setSecondSolution },
    { items: thirdSolution, setItems: setThirdSolution },
  ];
  const allColumns: ItemsArray[] = [
    { items: firstColumn, setItems: setFirstColumn },
    { items: secondColumn, setItems: setSecondColumn },
    { items: thirdColumn, setItems: setThirdColumn },
  ];

  useEffect(() => {
    resetColumns();

    randomlyAssign(setFirstColumn, setSecondColumn, setThirdColumn);
    randomlyAssign(setFirstSolution, setSecondSolution, setThirdSolution);
  }, []);

  useEffect(() => {
    let win: boolean = true;

    allSolution.forEach((column, columnIndex) => {
      column.items.forEach((item, itemIndex) => {
        if (
          !allColumns[columnIndex] ||
          !allColumns[columnIndex].items[itemIndex] ||
          allColumns[columnIndex].items[itemIndex].id !== item.id
        ) {
          win = false;
          console.log('not yet');
          return;
        }
      });
    });

    win ? console.log('you won') : '';
  }, [allColumns]);

  const randomlyAssign = (
    setFirst: React.Dispatch<React.SetStateAction<Item[]>>,
    setSecond: React.Dispatch<React.SetStateAction<Item[]>>,
    setThird: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    const shuffledItems = [...initialItems];
    shuffleArray(shuffledItems);

    // Distribute items randomly among the columns
    shuffledItems.forEach((item) => {
      // Randomly distribute among three columns
      const columnIndex = Math.floor(Math.random() * 3);
      switch (columnIndex) {
        case 0:
          setFirst((prev) => [...prev, item]);
          break;
        case 1:
          setSecond((prev) => [...prev, item]);
          break;
        case 2:
          setThird((prev) => [...prev, item]);
          break;
        default:
          break;
      }
    });
  }

  // Shuffle the array
  const shuffleArray = (array: Item[]) => {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Reset all columns
  const resetColumns = () => {
    setCountStep(0);
    setFirstColumn([]);
    setSecondColumn([]);
    setThirdColumn([]);
  }

  // Whether the element with the index is positioning at the top of the column
  const isAtTop = (index: number, columnIndex: number) => {
    return index + 1 !== allColumns[columnIndex].items.length;
  };

  // Only allows to drop at the top most position of the other columns
  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.source.droppableId === result.destination.droppableId
    ) {
      return;
    }

    const sourceId = parseInt(result.source.droppableId);
    const destId = parseInt(result.destination.droppableId);
    const sourceColumn = allColumns[sourceId];
    const dropedItem = sourceColumn.items[sourceColumn.items.length - 1];

    sourceColumn.setItems(prevItems => [...prevItems.slice(0, -1)]);
    allColumns[destId].setItems(prevItems => [...prevItems, dropedItem]);
    setCountStep((prev) => prev + 1);
  };

  return (
    <div className='flex flex-col gap-5 justify-around'>
      <div>
        {countStep}
      </div>

      <div>
        <div className='flex justify-center gap-1 w-full'>
          {[0, 1, 2].map((columnIndex) => (
            <div
              key={columnIndex}
              className=''
              style={{
                background: 'lightblue',
                padding: 16,
                width: 200,
                height: 360,
                display: 'flex',
                flexDirection: 'column-reverse', // Stack items from the bottom
              }}
            >
              {allSolution[columnIndex].items
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      userSelect: 'none',
                      padding: 16,
                      margin: '0 0 8px 0',
                      backgroundColor: '#263B4A',
                      color: 'white',
                      zIndex: 3,
                    }}
                  >
                    {item.content}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex justify-center gap-1 w-full'>
            {[0, 1, 2].map((columnIndex) => (
              <Droppable key={columnIndex} droppableId={columnIndex.toString()} direction="vertical">
                {(provided, snapshot) => (
                  <div
                    key={columnIndex}
                    ref={provided.innerRef}
                    className=''
                    style={{
                      background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                      padding: 16,
                      width: 200,
                      height: 360,
                      display: 'flex',
                      flexDirection: 'column-reverse', // Stack items from the bottom
                    }}
                  >
                    {allColumns[columnIndex].items
                      .map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isAtTop(index, columnIndex)}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: 16,
                                margin: '0 0 8px 0',
                                backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                color: 'white',
                                ...provided.draggableProps.style,
                              }}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Example;