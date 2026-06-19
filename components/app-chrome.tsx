'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/top-bar';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-8 md:pb-8 bg-background">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
