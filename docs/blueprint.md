# **App Name**: Gemini Chat

## Core Features:

- Chat Interface: A responsive UI for chatting, adapting to desktop, tablet, and mobile devices. Uses Next.js app router and Tailwind CSS.
- Environment Variable Configuration: The Gemini API key is configured exclusively via the Vercel environment variable GEMINI_API_KEY, ensuring security. The Gemini model is configured via the Vercel environment variable GEMINI_MODEL, defaulting to gemini-2.5-flash
- Streaming Response: Backend streams Gemini's responses to the frontend using Server-Sent Events (SSE) or ReadableStream, providing a real-time chat experience.
- Long Context Handling: Manages long conversation history for extended context. Provides a "one-click clear session" button to reset the conversation.
- Image Upload & Analysis: Supports image uploads, leveraging Gemini's multi-modal analysis capabilities to understand and respond based on image content.
- Web Tool Integration: The LLM will leverage a tool that determines whether the model needs to use web search, and if so, perform a search and incorporate the findings into its response.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to convey professionalism and clarity.
- Background color: Very light grey (#F0F2F5), near-white to ensure comfortable readability in a light scheme.
- Accent color: Cyan (#00BCD4) to draw attention to interactive elements without overwhelming the primary color.
- Body and headline font: 'Inter', a grotesque-style sans-serif, offering a modern, objective look suitable for both headlines and body text.
- Use simple, clear icons from a library like Material Icons for common actions (e.g., send, clear, upload).
- A clean, single-column layout optimized for mobile and scalable to larger screens. The message input area should be prominent and easy to access.
- Subtle transitions and loading animations to enhance the user experience, especially during streaming responses and image analysis.