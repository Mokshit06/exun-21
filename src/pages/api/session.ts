import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(404).end();

  const session = await getSession(req, res);

  await prisma.userSession.create({
    data: {
      startedAt: req.body.startedAt,
      endedAt: req.body.endedAt,
      userId: session.auth?.user,
    },
  });

  res.end();
}
