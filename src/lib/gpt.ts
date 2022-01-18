import axios from 'axios';

type CompletionOptions = {
  prompt: string;
  maxTokens?: number;
};

export function createCompletion(options: CompletionOptions) {
  const { prompt, maxTokens = 50 } = options;

  return axios
    .post<Completion>(
      'https://api.openai.com/v1/engines/curie-instruct-beta-v2/completions',
      {
        prompt,
        temperature: 0.1,
        max_tokens: Math.min(maxTokens, 200),
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )
    .then(r => r.data.choices[0].text);
}

export type Completion = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    text: string;
    index: number;
    logprobs?: number;
    finish_reason: string;
  }>;
};
