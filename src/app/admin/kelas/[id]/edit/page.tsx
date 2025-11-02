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

interface Guru {
  id: string;
  nama: string;
  jabatan: string | null;
}

interface Kelas {
  id: string;
  nama: string;
  waliId: string | null;
  pembinaId: string | null;
}

export default function EditKelasPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [formData, setFormData] = useState({
    nama: '',
    waliId: '',
    pembinaId: ''
  });

  useEffect(() => {
    fetchKelas();
    fetchGuru();
  }, [id]);

  const fetchKelas = async () => {
    try {
      const res = await fetch(`/api/admin/kelas/${id}`);
      const data = await res.json();
      
      if (res.ok) {
        setFormData({
          nama: data.nama,
          waliId: data.waliId || '',
          pembinaId: data.pembinaId || ''
        });
      } else {
        alert(data.error || 'Kelas tidak ditemukan');
        router.push('/admin/kelas');
      }
    } catch (error) {
      console.error("Gagal fetch data kelas:", error);
      alert('Terjadi kesalahan saat mengambil data kelas');
      router.push('/admin/kelas');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchGuru = async () => {
    try {
      const res = await fetch('/api/admin/guru');
      const data = await res.json();
      setGuruList(data);
    } catch (error) {
      console.error("Gagal fetch data guru:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/kelas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/kelas');
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal mengupdate kelas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupdate kelas');
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
        <Link href="/admin/kelas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Kelas</h1>
          <p className="text-muted-foreground">Edit data kelas yang ada di sistem.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Data Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Kelas *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  placeholder="Contoh: XII IPA 1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wali">Wali Kelas</Label>
                <Select value={formData.waliId} onValueChange={(value) => handleInputChange('waliId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih wali kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tidak ada wali kelas</SelectItem>
                    {guruList.map((guru) => (
                      <SelectItem key={guru.id} value={guru.id}>
                        {guru.nama} {guru.jabatan && `(${guru.jabatan})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pembina">Pembina</Label>
                <Select value={formData.pembinaId} onValueChange={(value) => handleInputChange('pembinaId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pembina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tidak ada pembina</SelectItem>
                    {guruList.map((guru) => (
                      <SelectItem key={guru.id} value={guru.id}>
                        {guru.nama} {guru.jabatan && `(${guru.jabatan})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Link href="/admin/kelas">
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