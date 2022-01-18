import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { description, name, ingredients, directions, price } = req.body;
    const { results } = await axios
      .get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          name.toLowerCase()
        )}&client_id=3dKVH4wrUND8E27vRTMU6J3437-BLNcDENWEyhwegiI&order_by=relevant`
      )
      .then(r => r.data);

    await prisma.candy.create({
      data: {
        description,
        image:
          results.length === 0
            ? ''
            : results.length > 1
            ? results[1].urls.regular
            : results[0].urls.regular,
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
