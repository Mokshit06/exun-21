import { IncomingMessage, ServerResponse } from 'http';
import { getSession } from './session';
import { Session } from 'next-session/lib/types';
import { redirect } from './server-side-props';
import prisma from './prisma';

export async function getUser(
  req: IncomingMessage & {
    session?: Session | undefined;
  },
  res: ServerResponse
) {
  const session = await getSession(req, res);

  if (!session.auth?.user) {
    throw redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.auth?.user },
  });
  return user!;
}
