'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { login } from '@/request/auth';
import { useUserStore } from '@/stores/user-store';
import { useRouter } from 'next/navigation';
import { useSnackBarStore } from '@/stores/snackbar-store';
import { get } from 'lodash';

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useUserStore((state) => state.setAuth);
  const snackbar = useSnackBarStore();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      snackbar.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password.length < 6 || password.length > 30) {
      snackbar.error('Mật khẩu phải từ 6 đến 30 ký tự');
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(identifier, password);

      if (get(response, 'permission')) {
        snackbar.error('Bạn không có quyền truy cập vào ứng dụng này');
        return;
      }
      if (response.jwt && response.user) {
        setAuth(response.user, response.jwt);
        snackbar.success('Đăng nhập thành công');
        router.push('/management/users');
      }
    } catch (error) {
      console.error('Login error:', error);
      snackbar.error(
        'Đăng nhập thất bại',
        error instanceof Error
          ? error.message
          : 'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="username"
                  placeholder="admin@example.com"
                  type="text"
                  className="pl-10"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
