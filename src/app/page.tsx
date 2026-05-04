'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  }, [router]);
  return null;
}