import Sidebar from '@/components/sidebar';
import Tag from '@/components/tag';
import { getUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { wrap } from '@/lib/server-side-props';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Task, User } from '@prisma/client';
import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useMemo, useState,Fragment } from 'react';
import { useQuery, useQueryClient } from 'react-query';

function AddComment(props: { user: User }) {
  const { user } = props;
  const [text, setText] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!text) return;

    const taskId = router.query.id;
    await axios.post(`/api/tasks/${taskId}/comments`, {
      text,
    });
    setText('');
    queryClient.invalidateQueries(`tasks/${taskId}`);
  };

  return (
    <Flex as="form" onSubmit={handleSubmit} mb={6} gridGap={4}>
      <Avatar name={user.name} size="md" />
      <Textarea
        rounded="lg"
        color="theme.light"
        fontSize="md"
        bg="theme.mediumGrey"
        outline="none"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a comment..."
        _placeholder={{ color: 'theme.lightGrey' }}
        lineHeight={1.6}
        py={3}
        rows={1}
        border="none"
      />
      <Button
        disabled={!text}
        size="lg"
        type="submit"
        bg="#253c56"
        color="#2787e3"
        _hover={{ bg: '#293e57' }}
        _active={{ bg: '#293e57' }}
      >
        Comment
      </Button>
    </Flex>
  );
}

function parseDescription(taskId: string, description: string) {
  //  Parse the description of the task, split at `\n`, if the line starts with `- [ ]` or `- [x]`, then replace that line with input element whose value is dependent on the `x` being there. on clicking the input, get the index of the line on which the input was clicked and replace the references of `[ ]` with `[x]`
}

function Description(props: { task: Task }) {
  const { task } = props;
  const queryClient = useQueryClient();

  const description = useMemo(() => {
    const lines = task.description.split('\n');

    return lines.map((line, index) => {
      const handleChange = async () => {
        await axios.put(`/api/tasks/${task.id}/check`, {
          lineIndex: index,
        });
        queryClient.invalidateQueries(`tasks/${task.id}`);
      };
      let element = <>{line}</>;

      if (line.startsWith('- [ ] ')) {
        element = (
          <>
            <Checkbox size="lg" defaultChecked={false} onChange={handleChange}>
              {line.replace('- [ ] ', '')}
            </Checkbox>
          </>
        );
      }

      if (line.startsWith('- [x] ')) {
        element = (
          <>
            <Checkbox size="lg" defaultChecked={true} onChange={handleChange}>
              {line.replace('- [x] ', '')}
            </Checkbox>
          </>
        );
      }

      return (
        <Fragment key={index}>
          {element}
          <br />
        </Fragment>
      )
    });
  }, [task, queryClient]);

  return (
    <Text lineHeight={1.6} fontSize="lg" color="theme.light">
      {description}
    </Text>
  );
}

export default function SingleTask(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { user, task: initialTask } = props;
  const task = useQuery(
    `tasks/${initialTask.id}`,
    () =>
      axios
        .get<{ data: typeof initialTask }>(`/api/tasks/${initialTask.id}`)
        .then(r => r.data.data),
    {
      initialData: initialTask,
    }
  ).data!;

  return (
    <Sidebar>
      <Flex px={10} py={10} flexDirection="column" gridGap={10} maxW="1100px">
        <Box>
          <Heading mb={6} fontSize="5xl" color="theme.light">
            {task.title}
          </Heading>
          <Flex gridGap={2} mb={6}>
            {task.tags.map(tag => (
              <Tag size="lg" key={tag}>
                {tag}
              </Tag>
            ))}
          </Flex>
          <Description task={task} />
        </Box>
        <Box>
          <Heading fontSize="3xl" mb={6} fontWeight={600} color="theme.light">
            Team members
          </Heading>
          <AvatarGroup max={4} size="lg">
            {task.assignedTo.map(user => (
              <Avatar
                borderColor="theme.darkGrey"
                key={user.id}
                name={user.name}
                src=""
              />
            ))}
          </AvatarGroup>
        </Box>
        <Box>
          <Heading fontSize="3xl" mb={6} fontWeight={600} color="theme.light">
            Comments
          </Heading>
          <Box>
            <AddComment user={user} />
            <Flex flexDir="column" gridGap={4}>
              {task.comments.map(comment => (
                <Flex
                  gridGap={4}
                  p={4}
                  rounded="lg"
                  bg="theme.grey"
                  key={comment.id}
                >
                  <Avatar name={comment.author.name} src="" />
                  <Box>
                    <Text color="theme.light" fontWeight={600}>
                      {comment.author.name}
                    </Text>
                    <Text color="theme.lightGrey">{comment.text}</Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Sidebar>
  );
}

export const getServerSideProps = wrap(async ctx => {
  const user = await getUser(ctx.req, ctx.res);
  const task = await prisma.task.findUnique({
    where: { id: ctx.query.id as string },
    include: {
      assignedTo: true,
      comments: { include: { author: true } },
    },
  });

  return {
    props: {
      user: serialize(user!),
      task: serialize(task!),
    },
  };
});
