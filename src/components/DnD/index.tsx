import { FC, useState, useCallback } from 'react';
import DnDItem from './Item';
import produce from 'immer';

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

export const DnDContainer: FC = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: 'Write a cool JS library',
    },
    {
      id: 2,
      text: 'Make it generic enough',
    },
    {
      id: 3,
      text: 'Write README',
    },
    {
      id: 4,
      text: 'Create some examples',
    },
    {
      id: 5,
      text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
    },
    {
      id: 6,
      text: '???',
    },
    {
      id: 7,
      text: 'PROFIT',
    },
  ]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevValues) =>
      produce(prevValues, (draft) => {
        const [dragging] = draft.splice(dragIndex, 1);

        draft.splice(hoverIndex, 0, dragging);

        return draft;
      })
    );
  }, []);

  return (
    <>
      {cards.map((card: Item, index: number) => (
        <DnDItem
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      ))}
    </>
  );
};
