import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Task, TaskPriority, TaskStatus } from '@prisma/client';

function Item() {
  return null;
}

function Card() {
  return null;
}

export default function Board({ tasks }: { tasks: Task[] }) {
  const [{ opacity, isDragging }, dragRef, dragPreview] = useDrag(() => ({
    type: 'works',
    item: { text: 'works' },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      isDragging: monitor.isDragging(),
    }),
  }));

  return <pre>{JSON.stringify(tasks, null, 2)}</pre>;

  return isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <div
      ref={dragRef}
      style={{
        backgroundColor: 'red',
        height: '100px',
        width: '100px',
        opacity,
      }}
    />
  );
}
