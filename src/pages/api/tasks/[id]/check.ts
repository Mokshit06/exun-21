import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const id = req.query.id as string;
    const lineIndex = req.body.lineIndex as number;
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(400).end();
    }

    await prisma.task.update({
      where: { id },
      data: {
        description: task.description
          .split('\n')
          .map((line, index) => {
            if (index === lineIndex) {
              if (line.startsWith('- [ ] ')) {
                return line.replace('- [ ] ', '- [x] ');
              }

              if (line.startsWith('- [x] ')) {
                return line.replace('- [x] ', '- [ ] ');
              }
            }
            return line;
          })
          .join('\n'),
      },
    });

    res.json({ message: 'Updated task' });
  }
}
