import type { NextApiRequest, NextApiResponse } from 'next';
import { Completion, createCompletion } from '@/lib/gpt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Completion>
) {
  if (req.method !== 'POST') return res.status(404).end();

  const completion = await createCompletion({
    prompt: req.body.prompt,
    maxTokens: req.body.maxTokens,
  });

  res.json(completion.data);
}
