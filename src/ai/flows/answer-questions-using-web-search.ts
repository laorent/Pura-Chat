'use server';
/**
 * @fileOverview An AI agent that answers questions using web search.
 *
 * - answerQuestionsUsingWebSearch - A function that answers questions using web search.
 * - AnswerQuestionsUsingWebSearchInput - The input type for the answerQuestionsUsingWebSearch function.
 * - AnswerQuestionsUsingWebSearchOutput - The return type for the answerQuestionsUsingWebSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {search} from '@/services/search';

const AnswerQuestionsUsingWebSearchInputSchema = z.object({
  query: z.string().describe('The question to answer.'),
});
export type AnswerQuestionsUsingWebSearchInput = z.infer<
  typeof AnswerQuestionsUsingWebSearchInputSchema
>;

const AnswerQuestionsUsingWebSearchOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsUsingWebSearchOutput = z.infer<
  typeof AnswerQuestionsUsingWebSearchOutputSchema
>;

export async function answerQuestionsUsingWebSearch(
  input: AnswerQuestionsUsingWebSearchInput
): Promise<AnswerQuestionsUsingWebSearchOutput> {
  return answerQuestionsUsingWebSearchFlow(input);
}

const webSearchTool = ai.defineTool(
  {
    name: 'webSearch',
    description: 'Use this to search the web for up-to-date information.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.string(),
  },
  async input => {
    // This can call any typescript function.
    // Return the search results...
    return search(input.query);
  }
);

const prompt = ai.definePrompt({
  name: 'answerQuestionsUsingWebSearchPrompt',
  tools: [webSearchTool],
  input: {schema: AnswerQuestionsUsingWebSearchInputSchema},
  output: {schema: AnswerQuestionsUsingWebSearchOutputSchema},
  prompt: `You are a helpful chatbot that answers questions using web search to find relevant information.  If the question requires up-to-date information, use the webSearch tool to find relevant information and incorporate it into your response.

Question: {{{query}}}`,
});

const answerQuestionsUsingWebSearchFlow = ai.defineFlow(
  {
    name: 'answerQuestionsUsingWebSearchFlow',
    inputSchema: AnswerQuestionsUsingWebSearchInputSchema,
    outputSchema: AnswerQuestionsUsingWebSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
