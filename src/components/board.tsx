import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  css,
  CSSObject,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  ModalCloseButton,
  ModalHeader,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Task, TaskPriority, TaskStatus, User } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import Select from 'react-select';
import { Formik, useField, Form } from 'formik';
import { useQuery } from 'react-query';
import { useRef } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { MdChatBubble } from 'react-icons/md';
import Tag from './tag';

const ITEM_TYPE = 'card';
type ItemType = {
  id: '';
  status: TaskStatus;
};

function AddTask(props: {
  status: TaskStatus;
  onClose: () => void;
  isOpen: boolean;
  tasks: Task[];
}) {
  const { isOpen, onClose, status, tasks } = props;
  const router = useRouter();
  const toast = useToast();
  const initialValues = {
    title: 'Untitled Task',
    description: '',
    priority: TaskPriority.LOW,
    status: TaskStatus.OPEN,
    dependsOn: [],
    assignedTo: [],
    tags: '',
    duration: 1,
  };
  const handleSubmit = async (values: typeof initialValues) => {
    const { data } = await axios.post('/api/tasks', {
      ...values,
      tags: values.tags
        .split(',')
        .map(t => t.trim())
        .filter(x => x !== ''),
    });
    onClose();
    router.replace(router.asPath);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay backdropFilter="blur(1px)" />
      <ModalContent color="theme.light" bg="theme.grey">
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <AddTaskForm tasks={tasks} onClose={onClose} />
        </Formik>
      </ModalContent>
    </Modal>
  );
}

function AddTaskForm(props: { tasks: Task[]; onClose(): void }) {
  const { onClose, tasks } = props;
  const { data: users = [] } = useQuery('users', () =>
    axios.get<{ data: User[] }>('/api/users').then(res => res.data.data)
  );
  const [titleInput, , titleHelpers] = useField('title');
  const [descriptionInput] = useField('description');
  const [tagsInput] = useField('tags');
  const [, , assignedToHelpers] = useField('assignedTo');
  const [, , dependsOnHelpers] = useField('dependsOn');
  const [durationInput] = useField('duration');

  const styles: CSSObject = {
    '.r-s__control': {
      bg: 'theme.mediumGrey',
      borderWidth: 0,
      rounded: 'lg',
    },
    '.r-s__input-container': {
      color: 'theme.light',
      fontWeight: 300,
    },
    '.r-s__multi-value__label': {
      color: '#58a0e4',
    },
    '.r-s__multi-value': {
      bg: '#2b486b',
      rounded: 'md',
    },
    '.r-s__multi-value__remove': {
      '&:hover': {
        color: 'white',
        bg: '#2b486b',
      },
    },
    '.r-s__menu': {
      bg: 'theme.mediumGrey',
    },
    '.r-s__option--is-focused': {
      bg: 'theme.grey',
    },
  };

  return (
    <Form>
      <ModalCloseButton />
      <ModalBody mt={5} gridGap={4} d="flex" flexDir="column">
        <Editable
          fontSize="xl"
          fontWeight={500}
          fontFamily="Inter"
          defaultValue="Untitled Task"
          value={titleInput.value}
          onChange={value => titleHelpers.setValue(value)}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            rounded="lg"
            color="theme.light"
            fontSize="md"
            bg="theme.mediumGrey"
            outline="none"
            py={3}
            border="none"
            {...descriptionInput}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tags</FormLabel>
          <Input
            rounded="lg"
            color="theme.light"
            fontSize="md"
            bg="theme.mediumGrey"
            py={3}
            border="none"
            {...tagsInput}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Duration (Days)</FormLabel>
          <Input
            rounded="lg"
            color="theme.light"
            fontSize="md"
            bg="theme.mediumGrey"
            py={3}
            border="none"
            type="number"
            min={1}
            max={30}
            {...durationInput}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Assigned to</FormLabel>
          <Box
            as={Select}
            className="r-s-container"
            classNamePrefix="r-s"
            rounded="md"
            bg="theme.mediumGrey"
            sx={styles}
            isMulti
            options={users.map(user => ({
              value: user.id,
              label: user.name,
            }))}
            onChange={
              ((value: { value: string }[]) => {
                assignedToHelpers.setValue(value.map(v => v.value));
              }) as any
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Depends on</FormLabel>
          <Box
            as={Select}
            className="r-s-container"
            classNamePrefix="r-s"
            rounded="md"
            bg="theme.mediumGrey"
            sx={styles}
            isMulti
            options={tasks.map(task => ({
              value: task.id,
              label: task.title,
            }))}
            onChange={
              ((value: { value: string }[]) => {
                dependsOnHelpers.setValue(value.map(v => v.value));
              }) as any
            }
          />
        </FormControl>
        {/* <Formik initialValues={initialValues} onSubmit={handleSubmit} /> */}
      </ModalBody>
      <ModalFooter>
        <Button
          color="theme.light"
          bg="theme.darkGrey"
          fontWeight={400}
          _hover={{ bg: 'theme.darkGrey' }}
          _active={{ bg: 'theme.darkGrey' }}
          type="submit"
        >
          Add Task
        </Button>
      </ModalFooter>
    </Form>
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
      p={4}
      flexDir="column"
      gap={3}
    >
      <Box>
        {/* <CTag size="sm" w="max-content">
          {task.priority}
        </CTag> */}
        <Text color="theme.light" fontSize="lg">
          {task.title}
        </Text>
      </Box>
      <Flex gridGap={2}>
        {task.tags.map(tag => (
          <Tag size="md" key={tag}>
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
  allTasks: TaskWithUser[];
  onDrop(item: ItemType, minitor: DropTargetMonitor, status: TaskStatus): void;
}) {
  const { status, allTasks } = props;
  const tasks = allTasks.filter(task => status === task.status);
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ITEM_TYPE,
    collect: monitor => ({ isOver: monitor.isOver() }),
    drop(item: ItemType, monitor) {
      props.onDrop(item, monitor, status);
    },
  }));
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box h="min-content" ref={dropRef} p={2} bg="theme.mediumGrey" rounded="md">
      <Text
        color="theme.light"
        fontSize="xl"
        fontFamily="Inter"
        mx={3}
        mt={1}
        mb={3}
        fontWeight={600}
        opacity={0.9}
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
              fontWeight={500}
              _hover={{ bg: 'theme.darkGrey' }}
              _active={{ bg: 'theme.darkGrey' }}
              onClick={onOpen}
            >
              Add a task
            </Button>
            {/* probably not the best performance wise to render a modal for each button */}
            {/* might need to bring it up to <Board /> */}
            <AddTask
              isOpen={isOpen}
              onClose={onClose}
              status={status}
              tasks={allTasks}
            />
          </>
        )}
      </Flex>
    </Box>
  );
}

type TaskWithUser = Task & { assignedTo: User[] };

export default function Board(props: {
  tasks: Array<TaskWithUser>;
  setTasks: React.Dispatch<
    React.SetStateAction<
      (Task & {
        assignedTo: User[];
        dependsOn: Task[];
      })[]
    >
  >;
}) {
  const { tasks, setTasks } = props;

  const handleDrop = async (
    item: ItemType,
    monitor: DropTargetMonitor,
    status: TaskStatus
  ) => {
    // syncing might cause some issues in the future
    // it works fine for now
    // but i might need to change it to react-query
    // and just revalidate cache in the background
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
    <Grid templateColumns={`repeat(${STATUSES.length}, 1fr)`} gap={4}>
      {[
        STATUSES.map(status => (
          <Card
            key={status}
            status={status}
            onDrop={handleDrop}
            allTasks={tasks}
          />
        )),
      ]}
    </Grid>
  );
}
