import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Grid,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Task, TaskStatus, User, TaskPriority } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import Tag from './tag';
// import { Formik, useField } from 'formik';
import { useMemo, useRef } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { MdChatBubble } from 'react-icons/md';

const ITEM_TYPE = 'card';
type ItemType = {
  id: '';
  status: TaskStatus;
};

function AddTask(props: {
  status: TaskStatus;
  onClose: () => void;
  isOpen: boolean;
}) {
  const { isOpen, onClose, status } = props;
  const toast = useToast();
  const initialValues = {
    title: '',
    description: '',
    priority: TaskPriority.LOW,
    status,
    dependsOn: [],
    assignedTo: [],
    dueDate: '',
    tags: [],
  };
  const handleSubmit = async (values: typeof initialValues) => {
    const { data } = await axios.post('/api/tasks', values);

    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent color="theme.light" bg="theme.mediumGrey">
        <ModalHeader>Add a task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Formik initialValues={initialValues} onSubmit={handleSubmit} /> */}
        </ModalBody>
        <ModalFooter>
          <Button
            color="theme.light"
            bg="theme.grey"
            _hover={{ bg: 'theme.darkGrey' }}
            _active={{ bg: 'theme.darkGrey' }}
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function Item(props: { task: Task & { assignedTo: User[] } }) {
  const { task } = props;
  const ref = useRef<HTMLDivElement>(null);
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
      <Flex gridGap={2}>
        {task.tags.map(tag => (
          <Tag fontSize="md" key={tag}>
            {tag}
          </Tag>
        ))}
      </Flex>
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
  const { isOpen, onClose, onOpen } = useDisclosure();

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
          <>
            <Button
              color="theme.light"
              bg="theme.grey"
              _hover={{ bg: 'theme.darkGrey' }}
              _active={{ bg: 'theme.darkGrey' }}
              onClick={onOpen}
            >
              Add a task
            </Button>
            {/* probably not the best performance wise to render a modal for each button */}
            {/* might need to bring it up to <Board /> */}
            <AddTask isOpen={isOpen} onClose={onClose} status={status} />
          </>
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

  const handleDrop = async (
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
    await axios.put(`/api/tasks/${item.id}`, {
      status,
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
