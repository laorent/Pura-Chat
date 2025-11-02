'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@/lib/types';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import type { Part } from '@google/generative-ai';

// Function to convert a File to a GoogleGenerativeAI.Part
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

interface ChatLayoutProps {
  password?: string;
}

export function ChatLayout({ password }: ChatLayoutProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const clearChat = () => {
    setMessages([]);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', parts: [] };
    
    if (imageFile) {
        try {
            const imagePart = await fileToGenerativePart(imageFile);
            userMessage.parts.push(imagePart);
        } catch (error) {
            console.error('Error processing image:', error);
            toast({
                title: 'Error',
                description: 'Failed to process the image. Please try another one.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }
    }

    if (input.trim()) {
        userMessage.parts.push({ text: input });
    }

    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setImageFile(null);

    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (password) {
        headers['Authorization'] = `Bearer ${password}`;
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: newMessages }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred');
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let modelResponse = '';
      
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        modelResponse += decoder.decode(value, { stream: true });

        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'model') {
                const updatedMessages = [...prev];
                updatedMessages[prev.length - 1] = { ...lastMessage, parts: [{ text: modelResponse }] };
                return updatedMessages;
            }
            return prev;
        });
      }
    } catch (error: any) {
        console.error('Error fetching chat response:', error);
        setMessages(prev => prev.slice(0, -1)); // Remove the user message if API fails
        toast({
            title: 'An Error Occurred',
            description: error.message || 'Failed to get a response from the server.',
            variant: 'destructive',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} />
      </div>
      <div className="shrink-0">
        <ChatInput
          input={input}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClear={clearChat}
          onImageChange={handleImageChange}
          imageFile={imageFile}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
