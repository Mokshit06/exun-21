import prisma from '@/lib/prisma';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const data = req.body as {
      title: string;
      description: string;
      priority: TaskPriority;
      status: TaskStatus;
      tags: string[];
      dependsOn: string[];
      assignedTo: string[];
      dueDate: string;
    };

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dependsOn: { connect: data.dependsOn.map(id => ({ id })) },
        assignedTo: { connect: data.assignedTo.map(id => ({ id })) },
        dueDate: data.dueDate,
        index: 0,
        tags: data.tags,
      },
    });

    return res.status(201).json({
      message: 'Created the task',
    });
  }

  res.status(400).json({
    message: 'This endpoint only accepts POST requests',
  });
}
