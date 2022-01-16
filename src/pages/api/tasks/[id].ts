import prisma from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const data = req.body as { status: TaskStatus };
    const id = req.query.id as string;

    await prisma.task.update({
      where: { id },
      data: { status: data.status },
    });

    return res.status(201).json({ message: 'Updated task' });
  }

  res.status(400).json({
    message: 'This endpoint only accepts PUT requests',
  });
}
