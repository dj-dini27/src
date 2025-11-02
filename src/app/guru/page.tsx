'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  Clock,
  TrendingUp,
  Bell,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function GuruDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Portal Guru</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.guru?.nama} ({user?.guru?.jabatan})
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user?.guru?.nama}!
          </h1>
          <p className="text-lg text-gray-600">
            Dashboard guru untuk mengelola kegiatan mengajar dan absensi
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                2 kelas tersisa
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">
                3 kelas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Bulan Ini</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                +5% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tugas Dinilai</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                12 pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>
                Akses fitur yang sering digunakan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/guru/absensi">
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Input Absensi Siswa
                </Button>
              </Link>
              <Link href="/guru/jadwal">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Lihat Jadwal Mengajar
                </Button>
              </Link>
              <Link href="/guru/nilai">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="mr-2 h-4 w-4" />
                  Input Nilai Siswa
                </Button>
              </Link>
              <Link href="/guru/kelas">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Kelola Data Kelas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Hari Ini</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">XII IPA 1</p>
                    <p className="text-sm text-gray-600">Matematika</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">07:00 - 08:30</p>
                    <Badge variant="secondary" className="text-xs">Selesai</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">XI IPA 2</p>
                    <p className="text-sm text-gray-600">Matematika</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">09:00 - 10:30</p>
                    <Badge variant="default" className="text-xs">Sedang Berlangsung</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">XII IPA 2</p>
                    <p className="text-sm text-gray-600">Matematika</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">11:00 - 12:30</p>
                    <Badge variant="outline" className="text-xs">Akan Datang</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">X IPA 1</p>
                    <p className="text-sm text-gray-600">Matematika</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">13:00 - 14:30</p>
                    <Badge variant="outline" className="text-xs">Akan Datang</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Aktivitas pengajaran Anda minggu ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Absensi kelas XII IPA 1</p>
                  <p className="text-sm text-muted-foreground">32 dari 35 siswa hadir</p>
                </div>
                <span className="text-xs text-muted-foreground">2 jam lalu</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Mengumpulkan tugas UTS</p>
                  <p className="text-sm text-muted-foreground">28 siswa sudah mengumpulkan</p>
                </div>
                <span className="text-xs text-muted-foreground">1 hari lalu</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Input nilai ulangan harian</p>
                  <p className="text-sm text-muted-foreground">Kelas XI IPA 2 - Matematika</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hari lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}