import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    return;
  }

  res.status(400).json({
    message: 'This endpoint only accepts PUT requests',
  });
}
