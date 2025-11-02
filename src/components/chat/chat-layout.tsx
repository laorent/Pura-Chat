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
    <div className="flex flex-1 flex-col overflow-hidden">
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
