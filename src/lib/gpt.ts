import axios from 'axios';

export function createCompletion({
  prompt,
  maxTokens = 50,
}: {
  prompt: string;
  maxTokens: number;
}) {
  return axios.get<Completion>(
    'https://api.openai.com/v1/engines/davinci-instruct-beta-v3/completions',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        prompt,
        temperature: 0.1,
        max_tokens: Math.min(maxTokens, 200),
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 0,
      },
    }
  );
}

export type Completion = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      text: string;
      index: number;
      logprobs?: number;
      finish_reason: string;
    }
  ];
};
