'use client';
import { Card } from '@tremor/react';

export default function Loading() {
  return (
    <Card className="flex justify-center items-center w-full h-screen shadow-none">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-gray-400" />
    </Card>
  );
}