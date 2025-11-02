'use client';

import { useState } from 'react';
import { ChatLayout } from '@/components/chat/chat-layout';
import { PasswordPrompt } from '@/components/password-prompt';

const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD;

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(!APP_PASSWORD);

  const handleSuccess = () => {
    setIsAuthenticated(true);
    // Store a session flag to persist authentication across reloads
    try {
      sessionStorage.setItem('is-authenticated', 'true');
    } catch (e) {
      console.error('Failed to set session storage', e);
    }
  };
  
  // Check session storage on initial load
  useState(() => {
    try {
      if (sessionStorage.getItem('is-authenticated') === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Failed to read session storage', e);
    }
  });


  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center gap-4">
      <div className="z-10 flex h-full w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between gap-4 border-b bg-background/80 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4.5v3M15 6l-3 3M18 7.5l-3 3M21 12h-3M18 16.5l-3-3M15 18l-3-3M12 19.5v-3M9 18l3-3M6 16.5l3-3M3 12h3M6 7.5l3 3M9 6l3 3" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Pura Chat</h1>
          </div>
        </header>
        {isAuthenticated ? (
          <ChatLayout password={APP_PASSWORD} />
        ) : (
          <PasswordPrompt
            onSuccess={handleSuccess}
            correctPassword={APP_PASSWORD}
          />
        )}
      </div>
    </main>
  );
}
