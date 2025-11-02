import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isModel = message.role === 'model';

  return (
    <div className={cn('mb-6 flex items-start gap-4', isModel ? '' : 'justify-end')}>
      {isModel && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback><Bot size={20} /></AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        'group relative max-w-[80%] rounded-xl px-4 py-3',
        isModel
          ? 'bg-secondary text-secondary-foreground'
          : 'bg-primary text-primary-foreground'
      )}>
        <div className="prose prose-sm max-w-none text-current dark:prose-invert">
          {message.parts.map((part, index) => {
            if ('text' in part) {
              if (part.text === '' && message.parts.length > 1) return null;
              if (part.text === '' && message.role === 'model') {
                return <Skeleton className="h-4 w-10" />;
              }
              return (
                <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                  {part.text}
                </ReactMarkdown>
              );
            }
            if ('inlineData' in part) {
              const { mimeType, data } = part.inlineData;
              const src = `data:${mimeType};base64,${data}`;
              return <Image key={index} src={src} alt="User upload" width={200} height={200} className="mt-2 rounded-lg" />;
            }
            return null;
          })}
        </div>
      </div>
      
      {!isModel && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback><User size={20} /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
