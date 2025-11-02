'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Calendar, Loader2 } from 'lucide-react';

interface DashboardStats {
  totalSiswa: number;
  totalGuru: number;
  totalKelas: number;
  todayAttendance: {
    percentage: number;
    present: number;
    total: number;
  };
  monthlyStats: {
    percentages: {
      hadir: number;
      izin: number;
      sakit: number;
      alpha: number;
      terlambat: number;
    };
  };
  recentActivities: {
    newStudents: Array<{
      type: string;
      message: string;
      timestamp: string;
      data: any;
    }>;
    attendance: Array<{
      type: string;
      message: string;
      timestamp: string;
      data: any;
    }>;
  };
  classDistribution: Array<{
    id: string;
    nama: string;
    _count: {
      siswa: number;
    };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      
      if (!res.ok) {
        throw new Error('Gagal mengambil data dashboard');
      }
      
      const data = await res.json();
      setStats(data);
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Terjadi kesalahan saat mengambil data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Tidak ada data tersedia</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di Sistem Informasi Sekolah</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSiswa}</div>
            <p className="text-xs text-muted-foreground">
              Total siswa terdaftar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuru}</div>
            <p className="text-xs text-muted-foreground">
              Total guru aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKelas}</div>
            <p className="text-xs text-muted-foreground">
              Total kelas aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAttendance.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayAttendance.present} dari {stats.todayAttendance.total} siswa
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kegiatan Terbaru</CardTitle>
            <CardDescription>
              Update terbaru dari sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats.recentActivities.newStudents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-blue-600">Siswa Baru</h4>
                  {stats.recentActivities.newStudents.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {stats.recentActivities.attendance.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-green-600">Absensi</h4>
                  {stats.recentActivities.attendance.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {stats.recentActivities.newStudents.length === 0 && stats.recentActivities.attendance.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada aktivitas terbaru
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Bulanan</CardTitle>
            <CardDescription>
              Data kehadiran bulan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hadir</span>
                <span className="text-sm text-muted-foreground">{stats.monthlyStats.percentages.hadir}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.monthlyStats.percentages.hadir}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Izin</span>
                <span className="text-sm text-muted-foreground">{stats.monthlyStats.percentages.izin}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.monthlyStats.percentages.izin}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sakit</span>
                <span className="text-sm text-muted-foreground">{stats.monthlyStats.percentages.sakit}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.monthlyStats.percentages.sakit}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alpha</span>
                <span className="text-sm text-muted-foreground">{stats.monthlyStats.percentages.alpha}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.monthlyStats.percentages.alpha}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Distribution */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Distribusi Kelas</CardTitle>
          <CardDescription>
            Jumlah siswa per kelas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.classDistribution.map((kelas) => (
              <div key={kelas.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{kelas.nama}</h4>
                  <span className="text-sm text-muted-foreground">
                    {kelas._count.siswa} siswa
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min((kelas._count.siswa / 40) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}