import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { description, name, ingredients, directions, price, image } =
      req.body;

    await prisma.candy.create({
      data: {
        description,
        image,
        name,
        ingredients,
        directions,
        price,
      },
    });

    return res.status(201).json({ message: 'Recipe created' });
  }

  return res.status(400).end();
}
