import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Paperclip, Eraser, SendHorizontal, X, LoaderCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onImageChange: (file: File | null) => void;
  imageFile: File | null;
  isLoading: boolean;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  onClear,
  onImageChange,
  imageFile,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="relative border-t bg-background p-4">
      {imageFile && (
        <div className="mb-2 w-fit rounded-lg border p-2">
          <div className="relative">
            <Image
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              width={80}
              height={80}
              className="rounded"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
              onClick={() => onImageChange(null)}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={onClear} disabled={isLoading}>
                <Eraser size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Chat</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" onClick={handleFileClick} disabled={isLoading}>
                <Paperclip size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload Image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="max-h-36 flex-1 resize-none self-center"
          rows={1}
          disabled={isLoading}
        />

        <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imageFile)}>
          {isLoading ? <LoaderCircle size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
        </Button>
      </form>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Powered by Google Gemini.
      </p>
    </div>
  );
}
