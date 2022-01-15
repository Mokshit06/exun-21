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
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return res.status(400).json({
      message: 'Account already exists',
    });
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 8),
    },
  });

  const session = await getSession(req, res);

  session.auth ||= {};
  session.auth.user = user.id;

  res.status(201).json({
    message: 'Registration successful',
  });
}
