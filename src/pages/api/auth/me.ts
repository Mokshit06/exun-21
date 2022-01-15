import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  const userId = session.auth?.userId as string | undefined;

  if (!userId) {
    return res.json({});
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  res.json(user);
}
