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
    <main className="flex h-[100dvh] flex-col items-center justify-center">
        {isAuthenticated ? (
          <ChatLayout password={APP_PASSWORD} />
        ) : (
          <PasswordPrompt
            onSuccess={handleSuccess}
            correctPassword={APP_PASSWORD}
          />
        )}
    </main>
  );
}
