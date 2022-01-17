import prisma from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  if (req.method === 'PUT') {
    const data = req.body as { status: TaskStatus };

    await prisma.task.update({
      where: { id },
      data: { status: data.status },
    });

    return res.status(201).json({ message: 'Updated task' });
  }

  if (req.method === 'GET') {
    const task = await prisma.task.findUnique({
      where: { id: id },
      include: {
        assignedTo: true,
        comments: { include: { author: true } },
      },
    });

    return res.json({ data: task });
  }

  res.status(400).json({
    message: 'This endpoint only accepts PUT, GET requests',
  });
}
