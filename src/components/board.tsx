import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Grid,
  Text,
} from '@chakra-ui/react';
import { Task, TaskStatus, User } from '@prisma/client';
import Link from 'next/link';
import { useCallback, useRef, useMemo, useEffect, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { MdChatBubble } from 'react-icons/md';

const ITEM_TYPE = 'card';
type ItemType = {
  id: string;
  status: TaskStatus;
  ref: React.RefObject<HTMLDivElement>;
};

const TagColors: Array<[string, string]> = [
  ['#253c56', '#2787e3'],
  ['#1c442d', '#1d9152'],
  ['#5b4019', '#c18435'],
];
let currTagIndex = 0;
function tagColor() {
  const tag = TagColors[currTagIndex];
  currTagIndex = currTagIndex === TagColors.length - 1 ? 0 : currTagIndex + 1;
  return tag;
}

function Tag({ children }: { children: string }) {
  let [bg, color] = useMemo(() => tagColor(), []);

  return (
    <Box px={2} py={0.5} bg={bg} w="max-content" rounded="md">
      <Text fontSize="sm" color={color}>
        {children}
      </Text>
    </Box>
  );
}

function Item(props: { task: Task & { assignedTo: User[] } }) {
  const { task } = props;
  const ref = useRef<HTMLDivElement>(null);
  // const [_, drop] = useDrop(() => ({
  //   accept: ITEM_TYPE,
  // }));
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id, status: task.status, ref },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  return isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <Flex
      ref={ref}
      bg="theme.darkGrey"
      rounded="md"
      shadow="md"
      py={4}
      px={5}
      flexDir="column"
      gap={3}
    >
      <Text color="theme.light" fontSize="lg">
        {task.title}
      </Text>
      <Box>
        {task.tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Box>
      <Flex align="center" justifyContent="space-between">
        <AvatarGroup max={3} size="sm">
          {task.assignedTo.map(user => (
            <Avatar
              borderColor="theme.darkGrey"
              key={user.id}
              name={user.name}
              src=""
            />
          ))}
        </AvatarGroup>
        <Link href={`/tasks/${task.id}`}>
          <a>
            <MdChatBubble color="#656565" size="1.3rem" />
          </a>
        </Link>
      </Flex>
    </Flex>
  );
}

const StatusMap = {
  [TaskStatus.DONE]: {
    title: 'Completed',
    icon: '',
  },
  [TaskStatus.STUCK]: {
    title: 'Stuck',
    icon: '',
  },
  [TaskStatus.IN_PROGRESS]: {
    title: 'In Progress',
    icon: '',
  },
  [TaskStatus.OPEN]: {
    title: 'Open',
    icon: '',
  },
};

const STATUSES = [
  TaskStatus.OPEN,
  TaskStatus.IN_PROGRESS,
  TaskStatus.STUCK,
  TaskStatus.DONE,
];

function Card(props: {
  status: TaskStatus;
  tasks: TaskWithUser[];
  onDrop(item: ItemType, minitor: DropTargetMonitor, status: TaskStatus): void;
}) {
  const { status, tasks } = props;
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ITEM_TYPE,
    collect: monitor => ({ isOver: monitor.isOver() }),
    drop(item: ItemType, monitor) {
      props.onDrop(item, monitor, status);
    },
  }));

  return (
    <Box h="min-content" ref={dropRef} p={3} bg="theme.mediumGrey" rounded="md">
      <Text
        color="theme.light"
        fontSize="2xl"
        mx={3}
        mt={1}
        mb={3}
        fontWeight={500}
      >
        {StatusMap[status].title}
      </Text>
      <Flex flexDir="column" gridGap={3}>
        {tasks.map(task => (
          <Item key={task.id} task={task} />
        ))}
        {isOver && (
          <Box bg="theme.grey" rounded="md" width="100%" height="150px"></Box>
        )}
        {tasks.length === 0 && (
          <Button
            color="theme.light"
            bg="theme.grey"
            _hover={{ bg: 'theme.darkGrey' }}
            _active={{ bg: 'theme.darkGrey' }}
          >
            Add a task
          </Button>
        )}
      </Flex>
    </Box>
  );
}

type TaskWithUser = Task & { assignedTo: User[] };

export default function Board(props: {
  tasks: Array<TaskWithUser>;
  setTasks: (
    updater: (tasks: Array<TaskWithUser>) => Array<TaskWithUser>
  ) => void;
}) {
  const { tasks, setTasks } = props;
  const handleDrop = (
    item: ItemType,
    monitor: DropTargetMonitor,
    status: TaskStatus
  ) => {
    setTasks(tasks => {
      const task = tasks.find(task => task.id === item.id);
      const newTasks = tasks.map(task => {
        if (task.id === item.id) {
          return { ...task, status };
        }

        return task;
      });

      return newTasks;
    });
  };

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
      {[
        STATUSES.map(status => (
          <Card
            key={status}
            status={status}
            onDrop={handleDrop}
            tasks={tasks.filter(task => task.status === status)}
          />
        )),
      ]}
    </Grid>
  );
}
