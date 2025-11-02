'use server';

/**
 * @fileOverview An image analysis AI agent.
 *
 * - analyzeUploadedImage - A function that handles the image analysis process.
 * - AnalyzeUploadedImageInput - The input type for the analyzeUploadedImage function.
 * - AnalyzeUploadedImageOutput - The return type for the analyzeUploadedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeUploadedImageInput = z.infer<typeof AnalyzeUploadedImageInputSchema>;

const AnalyzeUploadedImageOutputSchema = z.object({
  analysisResult: z.string().describe('The analysis result of the image.'),
});
export type AnalyzeUploadedImageOutput = z.infer<typeof AnalyzeUploadedImageOutputSchema>;

export async function analyzeUploadedImage(input: AnalyzeUploadedImageInput): Promise<AnalyzeUploadedImageOutput> {
  return analyzeUploadedImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUploadedImagePrompt',
  input: {schema: AnalyzeUploadedImageInputSchema},
  output: {schema: AnalyzeUploadedImageOutputSchema},
  prompt: `You are an expert image analyst. Analyze the content of the image and provide a detailed description and any relevant insights.\n\nImage: {{media url=photoDataUri}}`,
});

const analyzeUploadedImageFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedImageFlow',
    inputSchema: AnalyzeUploadedImageInputSchema,
    outputSchema: AnalyzeUploadedImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
