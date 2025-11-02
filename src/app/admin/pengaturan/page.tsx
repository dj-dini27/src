'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, School, Bell, Shield, Database } from 'lucide-react';

export default function PengaturanPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Sekolah Settings
    namaSekolah: 'SMA Negeri 1 Jakarta',
    alamat: 'Jl. Pendidikan No. 1, Jakarta Pusat',
    telepon: '021-12345678',
    email: 'info@sman1jakarta.sch.id',
    website: 'www.sman1jakarta.sch.id',
    
    // Sistem Settings
    notifikasiEmail: true,
    notifikasiPush: false,
    backupOtomatis: true,
    maintenanceMode: false,
    
    // Akademik Settings
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    jamMasuk: '07:00',
    jamPulang: '14:00',
    
    // Database Settings
    maxFileSize: '10',
    backupFrequency: 'daily'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola pengaturan sistem dan sekolah.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pengaturan Sekolah */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="w-5 h-5" />
              Informasi Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="namaSekolah">Nama Sekolah</Label>
                <Input
                  id="namaSekolah"
                  value={settings.namaSekolah}
                  onChange={(e) => handleInputChange('namaSekolah', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telepon">Telepon</Label>
                <Input
                  id="telepon"
                  value={settings.telepon}
                  onChange={(e) => handleInputChange('telepon', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Sekolah</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={settings.alamat}
                  onChange={(e) => handleInputChange('alamat', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pengaturan Sistem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Pengaturan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifikasiEmail">Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">Kirim notifikasi via email</p>
                </div>
                <Switch
                  id="notifikasiEmail"
                  checked={settings.notifikasiEmail}
                  onCheckedChange={(checked) => handleInputChange('notifikasiEmail', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifikasiPush">Notifikasi Push</Label>
                  <p className="text-sm text-muted-foreground">Kirim notifikasi push browser</p>
                </div>
                <Switch
                  id="notifikasiPush"
                  checked={settings.notifikasiPush}
                  onCheckedChange={(checked) => handleInputChange('notifikasiPush', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backupOtomatis">Backup Otomatis</Label>
                  <p className="text-sm text-muted-foreground">Backup database otomatis</p>
                </div>
                <Switch
                  id="backupOtomatis"
                  checked={settings.backupOtomatis}
                  onCheckedChange={(checked) => handleInputChange('backupOtomatis', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Mode Maintenance</Label>
                  <p className="text-sm text-muted-foreground">Tampilkan halaman maintenance</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pengaturan Akademik */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Pengaturan Akademik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tahunAjaran">Tahun Ajaran</Label>
                <Input
                  id="tahunAjaran"
                  value={settings.tahunAjaran}
                  onChange={(e) => handleInputChange('tahunAjaran', e.target.value)}
                  placeholder="Contoh: 2024/2025"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  value={settings.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                  placeholder="Contoh: Ganjil"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jamMasuk">Jam Masuk</Label>
                <Input
                  id="jamMasuk"
                  type="time"
                  value={settings.jamMasuk}
                  onChange={(e) => handleInputChange('jamMasuk', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jamPulang">Jam Pulang</Label>
                <Input
                  id="jamPulang"
                  type="time"
                  value={settings.jamPulang}
                  onChange={(e) => handleInputChange('jamPulang', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pengaturan Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Pengaturan Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Ukuran File Maksimal (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                <select
                  id="backupFrequency"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={settings.backupFrequency}
                  onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                >
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Button type="button" variant="outline">
                Backup Database Sekarang
              </Button>
              <Button type="button" variant="outline">
                Restore Database
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </form>
    </div>
  );
}