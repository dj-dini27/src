'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  Shield,
  ArrowRight,
  LogIn,
  UserPlus,
  School,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in (you can implement proper auth check here)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role: string) => {
    // Simulate login (implement proper authentication)
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userRole', role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  if (isLoggedIn) {
    // Redirect based on role
    if (userRole === 'ADMIN') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <School className="h-8 w-8 text-blue-600 mr-3" />
                  <span className="text-xl font-bold text-gray-900">Sistem Sekolah</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/admin">
                    <Button>Dashboard Admin</Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Selamat Datang, Admin!</CardTitle>
                <CardDescription>
                  Anda telah berhasil login sebagai Administrator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/admin">
                  <Button className="w-full">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Masuk ke Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    } else if (userRole === 'GURU') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <School className="h-8 w-8 text-green-600 mr-3" />
                  <span className="text-xl font-bold text-gray-900">Sistem Sekolah</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Selamat Datang, Guru!</CardTitle>
                <CardDescription>
                  Anda telah berhasil login sebagai Guru
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Link href="/guru/dashboard">
                    <Button className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Dashboard Guru
                    </Button>
                  </Link>
                  <Link href="/guru/absensi">
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Absensi
                    </Button>
                  </Link>
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    } else if (userRole === 'SISWA') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <School className="h-8 w-8 text-purple-600 mr-3" />
                  <span className="text-xl font-bold text-gray-900">Sistem Sekolah</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Selamat Datang, Siswa!</CardTitle>
                <CardDescription>
                  Anda telah berhasil login sebagai Siswa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Link href="/siswa/dashboard">
                    <Button className="w-full">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Dashboard Siswa
                    </Button>
                  </Link>
                  <Link href="/siswa/nilai">
                    <Button variant="outline" className="w-full">
                      <Award className="mr-2 h-4 w-4" />
                      Lihat Nilai
                    </Button>
                  </Link>
                </div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }

  // Landing Page for non-logged in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <School className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Sistem Informasi Sekolah</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Fitur
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Tentang
              </Button>
              <Button onClick={() => document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' })}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🎓 Sistem Manajemen Sekolah Modern
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Kelola Sekolah dengan
              <span className="text-blue-600"> Lebih Mudah</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Platform terintegrasi untuk mengelola data siswa, guru, absensi, dan notifikasi sekolah dalam satu sistem yang mudah digunakan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-8 py-6"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Mulai Sekarang
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-8 py-6"
              >
                Lihat Fitur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola sekolah secara digital
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Manajemen Siswa</CardTitle>
                <CardDescription>
                  Kelola data siswa, kelas, dan informasi akademik dengan mudah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Data siswa lengkap
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Pembagian kelas otomatis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tracking progres siswa
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Manajemen Guru</CardTitle>
                <CardDescription>
                  Kelola data guru, jadwal mengajar, dan penugasan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Profil guru lengkap
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Penugasan wali kelas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Jadwal mengajar fleksibel
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Sistem Absensi</CardTitle>
                <CardDescription>
                  Absensi digital untuk siswa dan guru dengan laporan real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Absensi real-time
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multiple status (hadir, izin, sakit)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Laporan bulanan
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Manajemen Kelas</CardTitle>
                <CardDescription>
                  Organisasi kelas, mata pelajaran, dan pembagian tugas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Struktur kelas lengkap
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Mata pelajaran per kelas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Penugasan guru
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Sistem Notifikasi</CardTitle>
                <CardDescription>
                  Kirim notifikasi penting ke siswa dan guru
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Notifikasi real-time
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Targeted messaging
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read status tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Dashboard Analytics</CardTitle>
                <CardDescription>
                  Laporan dan statistik lengkap untuk monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Visualisasi data
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Export laporan
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time statistics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Login ke Sistem
            </h2>
            <p className="text-xl text-gray-600">
              Pilih role Anda untuk masuk ke sistem
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Masuk dengan akun Anda untuk mengakses sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="guru">Guru</TabsTrigger>
                  <TabsTrigger value="siswa">Siswa</TabsTrigger>
                </TabsList>
                
                <TabsContent value="admin" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email" 
                      placeholder="admin@sekolah.sch.id"
                      defaultValue="admin@sekolah.sch.id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input 
                      id="admin-password" 
                      type="password" 
                      placeholder="Masukkan password"
                      defaultValue="admin123"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLogin('ADMIN')}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Login sebagai Admin
                  </Button>
                </TabsContent>
                
                <TabsContent value="guru" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guru-email">Email</Label>
                    <Input 
                      id="guru-email" 
                      type="email" 
                      placeholder="guru@sekolah.sch.id"
                      defaultValue="guru@sekolah.sch.id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guru-password">Password</Label>
                    <Input 
                      id="guru-password" 
                      type="password" 
                      placeholder="Masukkan password"
                      defaultValue="guru123"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLogin('GURU')}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Login sebagai Guru
                  </Button>
                </TabsContent>
                
                <TabsContent value="siswa" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siswa-nis">NIS</Label>
                    <Input 
                      id="siswa-nis" 
                      type="text" 
                      placeholder="Nomor Induk Siswa"
                      defaultValue="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siswa-password">Password</Label>
                    <Input 
                      id="siswa-password" 
                      type="password" 
                      placeholder="Masukkan password"
                      defaultValue="siswa123"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLogin('SISWA')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Login sebagai Siswa
                  </Button>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Untuk demo, gunakan password default sesuai role</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Tentang Sistem Kami
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Sistem Informasi Sekolah yang dirancang khusus untuk memudahkan manajemen pendidikan di era digital. 
            Dengan interface yang intuitif dan fitur lengkap, kami membantu sekolah Anda beroperasi lebih efisien.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Sekolah Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Pengguna</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <School className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-xl font-bold">Sistem Sekolah</span>
              </div>
              <p className="text-gray-400">
                Platform terintegrasi untuk manajemen sekolah modern
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Manajemen Siswa</li>
                <li>Manajemen Guru</li>
                <li>Sistem Absensi</li>
                <li>Notifikasi</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@sistemsekolah.sch.id</li>
                <li>(021) 1234-5678</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sistem Informasi Sekolah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}