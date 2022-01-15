import { Task, TaskStatus } from '@prisma/client';
import { useCallback, useRef } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = 'card';
type ItemType = { id: string };

function Item(props: {
  task: Task;
  moveItem(dragId: string, hoverId: string): void;
}) {
  const { task, moveItem } = props;
  const [_, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    hover(item: ItemType, monitor) {},
  }));
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id },
  }));
  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      drag(drop(element));
    },
    [drag, drop]
  );

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0 : 1 }} className="">
      {task.title}
    </div>
  );
}

function Card(props: {
  status: TaskStatus;
  children: React.ReactNode;
  onDrop(item: ItemType, minitor: DropTargetMonitor): void;
}) {
  const { status, children } = props;
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ITEM_TYPE,
    collect: monitor => ({ isOver: monitor.isOver() }),
    drop(item: ItemType, monitor) {
      props.onDrop(item, monitor);
    },
  }));

  return (
    <div ref={dropRef} className="">
      <h1>{status}</h1>
      {children}
    </div>
  );
}

export default function Board(props: {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}) {
  const { tasks, setTasks } = props;
  const moveItem = (dragId: string, hoverId: string) => {
    const item = tasks.find(task => task.id === dragId)!;
    const newTasks = tasks.filter(task => task.id !== dragId);
    const spliceAt = newTasks.findIndex(task => task.id === hoverId);
    newTasks.splice(spliceAt, 0, item);
    setTasks([...newTasks]);
  };

  const handleDrop = (item: ItemType, monitor: DropTargetMonitor) => {
    // setTasks()
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {[
        [
          TaskStatus.OPEN,
          TaskStatus.IN_PROGRESS,
          TaskStatus.STUCK,
          TaskStatus.DONE,
        ].map(status => (
          <Card key={status} status={status} onDrop={handleDrop}>
            {tasks
              .filter(task => task.status === status)
              .map(task => (
                <Item key={task.id} task={task} moveItem={moveItem} />
              ))}
          </Card>
        )),
      ]}
    </div>
  );
}
