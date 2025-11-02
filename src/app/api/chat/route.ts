import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import type { NextRequest } from 'next/server';
import type { ChatMessage } from '@/lib/types';
import type { Part, Content } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD;

// Safety settings for the generative model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Converts a Base64 string to a GoogleGenerativeAI.Part
function base64ToGenerativePart(base64: string, mimeType: string): Part {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

export async function POST(req: NextRequest) {
  if (APP_PASSWORD) {
    // In a real-world application, you'd want a more robust authentication check,
    // perhaps verifying a session token or a signed header.
    // For this example, we'll check a header. It's not secure for production.
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${APP_PASSWORD}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }


  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not found.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      tools: [{ googleSearch: {} }],
    });

    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    // The last message is the user's prompt
    const lastMessage = messages[messages.length - 1];
    
    // The history is all messages except the last one
    const history: Content[] = messages
      .slice(0, -1)
      .map(message => ({
        role: message.role,
        parts: message.parts,
      }));

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const chat = model.startChat({
        history,
        generationConfig,
        safetySettings,
    });
    
    const result = await chat.sendMessageStream(lastMessage.parts);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          try {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          } catch (error) {
            console.error('Error processing stream chunk:', error);
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An internal server error occurred.';
    if (error.message) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
