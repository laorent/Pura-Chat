import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { ChatMessage } from './chat-message';

interface ChatMessagesProps {
  messages: ChatMessageType[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="p-4 md:p-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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
          <h2 className="text-2xl font-semibold">你好！有什么可以帮您？</h2>
          <p className="max-w-md text-muted-foreground">
            您可以问我任何问题，或者上传图片进行分析。我也可以搜索网络以获取最新信息。
          </p>
        </div>
      )}
    </div>
  );
}
