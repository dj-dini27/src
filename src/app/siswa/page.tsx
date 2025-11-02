'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Award, 
  Clock,
  Bell,
  LogOut,
  Target,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function SiswaDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Portal Siswa</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.siswa?.nama} - {user?.siswa?.kelas?.nama}
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
            Selamat Datang, {user?.siswa?.nama}!
          </h1>
          <p className="text-lg text-gray-600">
            Dashboard siswa untuk melihat nilai, jadwal, dan informasi akademik
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nilai Rata-rata</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85.5</div>
              <p className="text-xs text-muted-foreground">
                +2.3 dari semester lalu
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">
                19 dari 20 hari
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tugas Selesai</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                2 pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peringkat</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                dari 35 siswa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>
                Akses fitur akademik Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/siswa/nilai">
                <Button className="w-full justify-start">
                  <Award className="mr-2 h-4 w-4" />
                  Lihat Nilai
                </Button>
              </Link>
              <Link href="/siswa/jadwal">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Jadwal Pelajaran
                </Button>
              </Link>
              <Link href="/siswa/tugas">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Daftar Tugas
                </Button>
              </Link>
              <Link href="/siswa/absensi">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
              Riwayat Absensi
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
                    <p className="font-medium">Matematika</p>
                    <p className="text-sm text-gray-600">Pak Budi Santoso</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">07:00 - 08:30</p>
                    <Badge variant="secondary" className="text-xs">Selesai</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Fisika</p>
                    <p className="text-sm text-gray-600">Bu Siti Aminah</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">09:00 - 10:30</p>
                    <Badge variant="default" className="text-xs">Sedang Berlangsung</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Kimia</p>
                    <p className="text-sm text-gray-600">Pak Ahmad Fauzi</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">11:00 - 12:30</p>
                    <Badge variant="outline" className="text-xs">Akan Datang</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Bahasa Indonesia</p>
                    <p className="text-sm text-gray-600">Bu Dewi Lestari</p>
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

        {/* Academic Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Nilai Mata Pelajaran</CardTitle>
              <CardDescription>
                Nilai semester ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Matematika</span>
                    <span className="font-medium">88</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fisika</span>
                    <span className="font-medium">85</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kimia</span>
                    <span className="font-medium">82</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bahasa Indonesia</span>
                    <span className="font-medium">90</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bahasa Inggris</span>
                    <span className="font-medium">87</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Tugas Terbaru</CardTitle>
              <CardDescription>
                Tugas yang perlu dikerjakan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">Ulangan Harian Matematika</p>
                    <p className="text-sm text-gray-600">Bab 5 - Trigonometri</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="text-xs">Besok</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Laporan Praktikum Fisika</p>
                    <p className="text-sm text-gray-600">Hukum Newton</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">3 hari lagi</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Essay Bahasa Indonesia</p>
                    <p className="text-sm text-gray-600">Analisis Puisi</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">Selesai</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Presentasi Kelompok Kimia</p>
                    <p className="text-sm text-gray-600">Struktur Atom</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">1 minggu lagi</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium">Ujian Tengah Semester Dimulai</p>
                  <p className="text-sm text-gray-600">UTS akan dimulai Senin depan, persiapkan diri Anda dengan baik.</p>
                  <p className="text-xs text-muted-foreground mt-1">2 jam lalu</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium">Nilai Fisika Telah Keluar</p>
                  <p className="text-sm text-gray-600">Nilai ulangan harian fisika Anda sudah bisa dilihat di portal nilai.</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hari lalu</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium">Pengumuman Ekstrakurikuler</p>
                  <p className="text-sm text-gray-600">Latihan basket hari Sabtu pukul 14:00, jangan lupa membawa seragam.</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hari lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}