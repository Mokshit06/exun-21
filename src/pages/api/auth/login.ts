import { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getSession } from '@/lib/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body as User;
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    return res.status(400).json({
      message: "Account doesn't exist",
    });
  }

  const passwordIsCorrect = await bcrypt.compare(data.password, user.password);
  if (!passwordIsCorrect) {
    return res.status(400).json({
      message: 'Username or password is incorrect',
    });
  }

  const session = await getSession(req, res);

  session.auth ||= {};
  session.auth.user = user.id;

  res.json({
    message: 'Login successful',
  });
}
