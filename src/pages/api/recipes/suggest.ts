import { createCompletion } from '@/lib/gpt';
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name } = req.body;

    const [descriptionText, recipeText] = await Promise.all([
      createCompletion({
        prompt: `write a 30 word essay for marketing of ${name}\n`,
        maxTokens: 100,
      }),
      createCompletion({
        prompt: `write the recipe and ingredients of ${name}\n`,
        maxTokens: 250,
      }),
    ]);

    const result = recipeText
      .trim()
      .replace(/Ingredients:(\s+)/, '')
      .replace(/(Directions|Instructions):/, '')
      .split('\n1.')
      .map(x => x.trim());

    await fs.writeFile(
      'data.ignore.json',
      JSON.stringify({ recipeText, result })
    );

    const [ingredients, directions] = result;

    res.json({
      description: descriptionText.trim(),
      recipe: { ingredients, directions },
    });
  }
}
