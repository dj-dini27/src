'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Siswa',
    href: '/admin/siswa',
    icon: Users,
  },
  {
    name: 'Guru',
    href: '/admin/guru',
    icon: GraduationCap,
  },
  {
    name: 'Kelas',
    href: '/admin/kelas',
    icon: BookOpen,
  },
  {
    name: 'Absensi',
    href: '/admin/absensi',
    icon: Calendar,
  },
  {
    name: 'Notifikasi',
    href: '/admin/notifikasi',
    icon: Bell,
  },
  {
    name: 'Pengaturan',
    href: '/admin/pengaturan',
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Sistem Admin
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <button className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}