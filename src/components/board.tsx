import { useDrag } from 'react-dnd';

function Item() {
  return null;
}

function Card() {
  return null;
}

export function Board() {
  const [{ opacity }, dragRef, dragPreview] = useDrag(() => ({
    type: 'works',
    item: { text: 'works' },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  }));

  return <div />;
}
