import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await getSession(req, res);
    const data = req.body as { text: string };
    const id = req.query.id as string;

    if (!session.auth?.user) {
      return res.status(400).json({ message: "You're not logged in" });
    }

    await prisma.comment.create({
      data: {
        taskId: id,
        text: data.text,
        userId: session.auth.user,
      },
    });

    return res.status(201).json({ message: 'Created comment' });
  }

  res.status(400).json({
    message: 'This endpoint only accepts POST requests',
  });
}
