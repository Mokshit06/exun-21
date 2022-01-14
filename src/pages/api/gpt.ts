import type { NextApiRequest, NextApiResponse } from 'next';
import { Completion, createCompletion } from '../../lib/gpt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Completion>
) {
  const completion = await createCompletion({
    prompt: req.body.prompt,
    maxTokens: req.body.maxTokens,
  });

  res.json(completion.data);
}
