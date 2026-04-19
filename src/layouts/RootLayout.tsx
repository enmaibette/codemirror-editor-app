import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export default function RootLayout() {
  return (
    <div className="flex flex-col h-full bg-(--background)">
      <Header />
      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
