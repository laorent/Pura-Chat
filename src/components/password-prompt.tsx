'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

interface PasswordPromptProps {
  onSuccess: () => void;
  correctPassword?: string;
}

export function PasswordPrompt({
  onSuccess,
  correctPassword,
}: PasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a network request to prevent brute-force attacks from being too fast.
    setTimeout(() => {
      if (password === correctPassword) {
        onSuccess();
      } else {
        toast({
          title: '密码错误',
          description: '请输入正确的访问密码。',
          variant: 'destructive',
        });
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>需要密码</CardTitle>
          <CardDescription>
            请输入访问密码以继续。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" disabled={isLoading || !password}>
              {isLoading && <LoaderCircle className="mr-2 animate-spin" />}
              进入
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
