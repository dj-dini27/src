'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Kelas {
  id: string;
  nama: string;
}

interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  email: string;
  noHP: string;
  nama: string | null;
  alamat: string | null;
  kelasId: string | null;
}

export default function EditSiswaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    email: '',
    noHP: '',
    nama: '',
    alamat: '',
    kelasId: ''
  });

  useEffect(() => {
    fetchSiswa();
    fetchKelas();
  }, [id]);

  const fetchSiswa = async () => {
    try {
      const res = await fetch(`/api/admin/siswa/${id}`);
      const data = await res.json();
      
      if (res.ok) {
        setFormData({
          nis: data.nis,
          nisn: data.nisn,
          email: data.email,
          noHP: data.noHP,
          nama: data.nama || '',
          alamat: data.alamat || '',
          kelasId: data.kelasId || ''
        });
      } else {
        alert(data.error || 'Siswa tidak ditemukan');
        router.push('/admin/siswa');
      }
    } catch (error) {
      console.error("Gagal fetch data siswa:", error);
      alert('Terjadi kesalahan saat mengambil data siswa');
      router.push('/admin/siswa');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await fetch('/api/admin/kelas');
      const data = await res.json();
      setKelasList(data);
    } catch (error) {
      console.error("Gagal fetch data kelas:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/siswa/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nis,
          nisn,
          email,
          noHP,
          nama: nama || null,
          alamat: alamat || null,
          kelasId: kelasId === 'none' ? null : kelasId
        }),
      });

      if (res.ok) {
        router.push('/admin/siswa');
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal mengupdate siswa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupdate siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/siswa">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Siswa</h1>
          <p className="text-muted-foreground">Edit data siswa yang ada di sistem.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Data Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS *</Label>
                <Input
                  id="nis"
                  value={formData.nis}
                  onChange={(e) => handleInputChange('nis', e.target.value)}
                  placeholder="Nomor Induk Siswa"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nisn">NISN *</Label>
                <Input
                  id="nisn"
                  value={formData.nisn}
                  onChange={(e) => handleInputChange('nisn', e.target.value)}
                  placeholder="Nomor Induk Siswa Nasional"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="noHP">No HP *</Label>
                <Input
                  id="noHP"
                  value={formData.noHP}
                  onChange={(e) => handleInputChange('noHP', e.target.value)}
                  placeholder="08123456789"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  placeholder="Nama lengkap siswa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas</Label>
                <Select value={formData.kelasId} onValueChange={(value) => handleInputChange('kelasId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada kelas</SelectItem>
                    {kelasList.map((kelas) => (
                      <SelectItem key={kelas.id} value={kelas.id}>
                        {kelas.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <textarea
                id="alamat"
                className="w-full min-h-[100px] px-3 py-2 text-sm ring-offset-background border border-input bg-background rounded-md"
                value={formData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                placeholder="Alamat lengkap siswa"
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <Link href="/admin/siswa">
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Menyimpan...' : 'Update'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}