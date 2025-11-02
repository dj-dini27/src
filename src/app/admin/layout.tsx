import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden md:block w-64 min-h-screen bg-muted/40 border-r">
          <Sidebar />
        </aside>
        <div className="flex-1">
          <Header />
          <main className="container mx-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}