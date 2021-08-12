import { FC, useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

import { XYCoord } from 'dnd-core';

const style = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const ItemTypes = {
  ITEM: 'item',
};

export interface DnDItemProps {
  id: any;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DnDItem: FC<DnDItemProps> = ({ id, text, index, moveCard }) => {
  const previewAndDropRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, dropRef] = useDrop({
    accept: ItemTypes.ITEM,

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },

    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!previewAndDropRef.current) {
        return;
      }

      const dragIndex = item.index;

      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect =
        previewAndDropRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    type: ItemTypes.ITEM,

    item: () => {
      return { id, index };
    },

    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  previewRef(dropRef(previewAndDropRef));

  return (
    <div
      ref={previewAndDropRef}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
    >
      <div
        ref={dragRef}
        style={{
          backgroundImage: 'url("/drag.svg")',
          height: '24px',
          width: '32px',
        }}
      />
      {text}
    </div>
  );
};

export default DnDItem;
