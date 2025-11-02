'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Trash2, Eye, EyeOff, Users, GraduationCap } from 'lucide-react';

interface Notifikasi {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function NotifikasiPage() {
  const [notifikasiList, setNotifikasiList] = useState<Notifikasi[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchNotifikasi();
    fetchUsers();
  }, []);

  const fetchNotifikasi = async () => {
    try {
      const res = await fetch('/api/admin/notifikasi');
      const data = await res.json();
      setNotifikasiList(data);
    } catch (error) {
      console.error("Gagal fetch data notifikasi:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch siswa
      const siswaRes = await fetch('/api/admin/siswa');
      const siswaData = await siswaRes.json();
      
      // Fetch guru
      const guruRes = await fetch('/api/admin/guru');
      const guruData = await guruRes.json();
      
      const users = [
        ...siswaData.map((siswa: any) => ({
          id: siswa.id,
          name: siswa.nama || 'Tanpa Nama',
          email: siswa.email,
          role: 'SISWA'
        })),
        ...guruData.map((guru: any) => ({
          id: guru.id,
          name: guru.nama,
          email: guru.email,
          role: 'GURU'
        }))
      ];
      
      setUserList(users);
    } catch (error) {
      console.error("Gagal fetch data users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/notifikasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ userId: '', title: '', message: '' });
        fetchNotifikasi();
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal menambah notifikasi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambah notifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/admin/notifikasi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (res.ok) {
        fetchNotifikasi();
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal mengupdate notifikasi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupdate notifikasi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/notifikasi/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchNotifikasi();
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal menghapus notifikasi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus notifikasi');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SISWA':
        return <Users className="w-4 h-4" />;
      case 'GURU':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SISWA':
        return 'bg-blue-100 text-blue-800';
      case 'GURU':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifikasi</h1>
          <p className="text-muted-foreground">Kelola notifikasi untuk siswa dan guru.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Tambah Notifikasi */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Kirim Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user">Penerima</Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih penerima" />
                  </SelectTrigger>
                  <SelectContent>
                    {userList.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          {user.name} ({user.email})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Judul notifikasi"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Pesan *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Isi pesan notifikasi"
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Mengirim...' : 'Kirim Notifikasi'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Daftar Notifikasi */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Daftar Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {notifikasiList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada notifikasi</p>
                </div>
              ) : (
                notifikasiList.map((notifikasi) => (
                  <div
                    key={notifikasi.id}
                    className={`p-4 rounded-lg border ${
                      notifikasi.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{notifikasi.title}</h4>
                          {!notifikasi.read && (
                            <Badge variant="default" className="text-xs">
                              Baru
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notifikasi.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getRoleIcon(notifikasi.user.role === 'siswa' ? 'SISWA' : 'GURU')}
                            {notifikasi.user.name}
                          </span>
                          <span>{notifikasi.user.email}</span>
                          <span>{new Date(notifikasi.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleRead(notifikasi.id, notifikasi.read)}
                          title={notifikasi.read ? 'Tandai sebagai belum dibaca' : 'Tandai sebagai sudah dibaca'}
                        >
                          {notifikasi.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notifikasi.id)}
                          title="Hapus notifikasi"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}