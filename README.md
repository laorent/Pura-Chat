# Pura Chat

This is a Next.js (App Router) chatbot web application that uses the Google Gemini API to provide a streaming, conversational AI experience. It is designed for easy deployment to Vercel.

## Features

- **Responsive UI**: A clean, modern chat interface that works seamlessly on desktop, tablet, and mobile devices.
- **Streaming Responses**: Real-time message streaming from Gemini for a dynamic user experience.
- **Multimodal Input**: Supports text prompts and image uploads for analysis by Gemini's vision capabilities.
- **Conversation History**: Maintains conversation context for follow-up questions.
- **Password Protection (Optional)**: Secure your app with an access password using an environment variable.
- **Clear Session**: A one-click button to clear the current chat history and start fresh.
- **Web Search Integration**: The model can use Google Search to answer questions that require up-to-date information.
- **Secure API Key Handling**: API keys are managed securely through environment variables, perfect for platforms like Vercel.
- **Configurable Model**: The Gemini model can be easily changed via an environment variable.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Google Gemini API](https://ai.google.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [pnpm](https://pnpm.io/installation) (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/gemini-chat.git
    cd gemini-chat
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    - Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Create a `.env.local` file in the root of your project by copying the example file:
      ```bash
      cp .env.example .env.local
      ```
    - Open `.env.local` and add your Gemini API key and optional access password:
      ```
      GEMINI_API_KEY="YOUR_API_KEY_HERE"
      GEMINI_MODEL="gemini-2.5-flash"
      
      # (Optional) Set a password to protect access to the application.
      # If commented out or left empty, the app will be publicly accessible.
      NEXT_PUBLIC_APP_PASSWORD="your-secret-password"
      ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or the specified port) with your browser to see the result.

## Deployment on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project into Vercel.
3.  Configure the Environment Variables:
    - Go to your project's "Settings" tab and then "Environment Variables".
    - Add the `GEMINI_API_KEY` with your key.
    - (Optional) Add `GEMINI_MODEL` if you wish to use a different model than the default `gemini-2.5-flash`.
    - (Optional) Add `NEXT_PUBLIC_APP_PASSWORD` to set an access password for your deployed application.
4.  Click "Deploy". Your Pura Chat app will be live!

## Code Structure

-   `src/app/page.tsx`: The main page component for the chat interface.
-   `src/app/api/chat/route.ts`: The API route that handles server-side communication with the Gemini API and streams responses.
-   `src/components/chat/`: Contains all the React components related to the chat UI (`ChatLayout`, `ChatMessages`, `ChatMessage`, `ChatInput`).
-   `src/lib/types.ts`: Defines shared TypeScript types used across the application.
-   `src/app/globals.css`: Global styles and Tailwind CSS theme configuration.
-   `tailwind.config.ts`: Tailwind CSS configuration file.
-   `.env.example`: Example file for required environment variables.

