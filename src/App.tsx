import React, { useEffect, useRef, useState } from 'react';

import { Info } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { 
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';

import { Block, Tower } from './models/models';
import HowToModal from './components/HowToModal';
import WinModal from './components/WinModal';
import OverModal from './components/OverModal';

const initialBlocks: Block[] = [
  { id: 0, color: 'bg-gradient-to-r from-yellow-400 to-amber-500' },
  { id: 1, color: 'bg-gradient-to-r from-lime-400 to-emerald-500' },
  { id: 2, color: 'bg-gradient-to-r from-orange-500 to-red-600' },
  { id: 3, color: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
  { id: 4, color: 'bg-gradient-to-r from-pink-500 to-rose-600' },
];

const Home: React.FC = () => {
  const isMounted = useRef(false);
  const [open, setOpen] = useState<boolean>(true);
  const [openWin, setOpenWin] = useState<boolean>(false);
  const [over, setOver] = useState<boolean>(false);
  const [date, setDate] = useState<number>(Date.now());
  const [time, setTime] = useState<number>(0);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [countStep, setCountStep] = useState<number>(0);
  const [firstPattern, setFirstPattern] = useState<Block[]>([]);
  const [secondPattern, setSecondPattern] = useState<Block[]>([]);
  const [thirdPattern, setThirdPattern] = useState<Block[]>([]);
  const [firstTower, setFirstTower] = useState<Block[]>([]);
  const [secondTower, setSecondTower] = useState<Block[]>([]);
  const [thirdTower, setThirdTower] = useState<Block[]>([]);
  const patterns: Tower[] = [
    { blocks: firstPattern, setBlocks: setFirstPattern },
    { blocks: secondPattern, setBlocks: setSecondPattern },
    { blocks: thirdPattern, setBlocks: setThirdPattern },
  ];
  const towers: Tower[] = [
    { blocks: firstTower, setBlocks: setFirstTower },
    { blocks: secondTower, setBlocks: setSecondTower },
    { blocks: thirdTower, setBlocks: setThirdTower },
  ];

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isCounting) {
        getTime();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [date, isCounting]);

  useEffect(() => {
    if (isMounted.current) {
      isMatching();
    } else {
      isMounted.current = true;
    }
  }, [towers]);

  useEffect(() => {
    if (isMounted.current) {
      if (time > 59) {
        setIsCounting(false);
        setOver(true);
      }
    } else {
      isMounted.current = true;
    }
  }, [time]);

  const getTime = () => {
    const time = Date.now() - date;

    setTime(Math.floor((time / 1000) % 61));
  };

  const isMatching = () => {
    let matching: boolean = true;

    patterns.forEach((tower, towerIndex) => {
      tower.blocks.forEach((block, blockIndex) => {
        if (
          !towers[towerIndex] ||
          !towers[towerIndex].blocks[blockIndex] ||
          towers[towerIndex].blocks[blockIndex].id !== block.id
        ) {
          matching = false;
        }
      });
    });

    if (matching) {
      setIsCounting(false);
      setOpenWin(true);
    }
  };

  const randomlyAssign = (
    setFirst: React.Dispatch<React.SetStateAction<Block[]>>,
    setSecond: React.Dispatch<React.SetStateAction<Block[]>>,
    setThird: React.Dispatch<React.SetStateAction<Block[]>>
  ) => {
    const shuffledBlocks = [...initialBlocks];
    shuffleArray(shuffledBlocks);

    // Distribute items randomly among the columns
    shuffledBlocks.forEach((block) => {
      // Randomly distribute among three columns
      const columnIndex = Math.floor(Math.random() * 3);
      switch (columnIndex) {
        case 0:
          setFirst((prev) => [...prev, block]);
          break;
        case 1:
          setSecond((prev) => [...prev, block]);
          break;
        case 2:
          setThird((prev) => [...prev, block]);
          break;
        default:
          break;
      }
    });
  };

  // Shuffle the array
  const shuffleArray = (array: Block[]) => {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Reset all columns
  const reset = () => {
    setCountStep(0);
    patterns.forEach((tower) => tower.setBlocks([]));
    towers.forEach((tower) => tower.setBlocks([]));
    randomlyAssign(setFirstPattern, setSecondPattern, setThirdPattern);
    randomlyAssign(setFirstTower, setSecondTower, setThirdTower);
    setTime(0);
    setDate(Date.now());
    setIsCounting(true);
  };

  // Whether the element with the index is positioning at the top of the column
  const isAtTop = (blockIndex: number, towerIndex: number) => {
    return blockIndex + 1 !== towers[towerIndex].blocks.length;
  };

  const isDroppable = (towerIndex: number, blockIndex: number) => {
    return towers[towerIndex].blocks.length <= blockIndex;
  };

  // Only allows to drop at the top most position of the other columns
  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.source.droppableId === result.destination.droppableId
    ) {
      return;
    }

    const sourceId = parseInt(result.source.droppableId.substring(0, 1));
    const destId = parseInt(result.destination.droppableId.substring(0, 1));

    if (sourceId === destId) return;

    const sourceTower = towers[sourceId];
    const draggingBlock = sourceTower.blocks[sourceTower.blocks.length - 1];

    sourceTower.setBlocks(prevItems => [...prevItems.slice(0, -1)]);
    towers[destId].setBlocks(prevItems => [...prevItems, draggingBlock]);
    setCountStep((prev) => prev + 1);
  };

  return (
    <main className='bg-slate-800 h-full w-full'
    >
      <div className='
        min-h-screen flex flex-col w-full
        justify-around items-center p-5
        '
      >
        <HowToModal open={open} setOpen={setOpen} reset={reset} />
        <OverModal open={over} setOpen={setOver} reset={reset} />
        <WinModal
          open={openWin}
          setOpen={setOpenWin}
          reset={reset}
          time={time}
          steps={countStep}
        />

        <div className='flex flex-col items-center gap-7'>
          <div className='flex justify-between gap-2'>
            <div className='
              max-w-[180px] border-2 border-neutral-300 rounded-lg px-3 md:px-5
              pb-1 pt-3 bg-white
              '
            >
              <div className='flex justify-center gap-1'>
                {[0, 1, 2].map((towerIndex) => (
                  <div className='
                    w-8 md:w-12 h-full flex flex-col-reverse
                    justify-center items-center gap-[0.1rem]
                    '
                    key={towerIndex}
                  >
                    {patterns[towerIndex].blocks
                      .map((block) => (
                        <div className={`
                          w-8 h-8 md:w-12 md:h-10 rounded-lg md:rounded-xl
                          ${block.color}
                          `}
                          key={block.id}
                        />
                      ))}

                    {new Array(5 - patterns[towerIndex].blocks.length).fill(0)
                      .map((_, index) => (
                        <div className='
                          w-8 h-8 md:w-12 md:h-10 rounded-lg md:rounded-xl
                          border-2 invisible
                          '
                          key={index}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>

            <div className='w-[100px] h-full flex flex-col gap-2 self-end'>
              <div className='flex gap-2 justify-center'>
                <div className="rounded-full bg-slate-200 p-2"
                  role="button"
                  onClick={() => {
                    setOpen(true);
                    reset();
                  }}
                >
                  <Info />
                </div>

                <div className="rounded-full bg-slate-200 p-2"
                  role="button"
                  onClick={() => reset()}
                >
                  <RotateCcw />
                </div>
              </div>

              <div className='
                border-2 border-neutral-300 rounded-lg bg-white w-full h-[80px]
                flex flex-col py-2 justify-around items-center
                '
              >
                <h2 className='font-semibold'>Timer</h2>
                <p>{time}</p>  
              </div>
              <div className='
                border-2 border-neutral-300 rounded-lg bg-white w-full h-[80px]
                flex flex-col py-2 justify-around items-center
                '
              >
                <h2 className='font-semibold'>Steps</h2>
                <p>{countStep}</p>
              </div>
            </div>
          </div>

          <div className='max-w-[320px] bg-white rounded-lg overflow-hidden pt-2 px-1 pb-1'>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className='flex justify-center gap-2 md:gap-3 max-w-[320px]'>
                {[0, 1, 2].map((towerIndex) => (
                  <div className='
                    w-16 md:w-24 h-full flex flex-col-reverse
                    justify-center items-center gap-[0.1rem]
                    '
                    key={towerIndex}
                  >
                    <div className='w-14 md:w-24 h-2 md:h-3 rounded-xl border-2 bg-neutral-100' />

                    {[0, 1, 2, 3, 4].map((rowIndex) => (
                      <Droppable
                        key={rowIndex}
                        droppableId={towerIndex.toString() + rowIndex.toString()}
                        direction="vertical"
                        isDropDisabled={!isDroppable(towerIndex, rowIndex)}
                      >
                        {(provided, snapshot) => (
                          <div
                            key={rowIndex}
                            ref={provided.innerRef}
                            className={`
                              w-10 h-9 md:w-16 md:h-14 flex justify-center items-center
                              rounded-xl border-dashed
                              ${snapshot.isDraggingOver &&
                                'transform scale-110 border-4 border-slate-400/10bg-neutral-100'
                              }
                            `}
                          >
                            {towers[towerIndex].blocks
                              .map((block, blockIndex) => {
                                if (blockIndex === rowIndex) {
                                  return (
                                    <Draggable
                                      key={block.id}
                                      draggableId={block.id.toString()}
                                      index={blockIndex}
                                      isDragDisabled={isAtTop(blockIndex, towerIndex)}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`
                                            w-10 h-9 rounded-lg md:w-16 md:h-14 md:rounded-xl ${block.color}
                                            ${isAtTop(blockIndex, towerIndex) ? '' :
                                              'hover:scale-105 ease-in-out'
                                            }
                                          `}
                                        />
                                      )}
                                    </Draggable>
                                  )
                                } else {
                                  return null;
                                }
                              })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      ))}
                  </div>
                  ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
