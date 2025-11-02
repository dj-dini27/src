'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from 'lucide-react';

interface Guru {
  id: string;
  nama: string;
  jabatan: string | null;
}

export default function TambahKelasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [formData, setFormData] = useState({
    nama: '',
    waliId: '',
    pembinaId: ''
  });

  useEffect(() => {
    fetchGuru();
  }, []);

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
      const res = await fetch('/api/admin/kelas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/kelas');
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal menambah kelas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambah kelas');
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
          <h1 className="text-3xl font-bold">Tambah Kelas</h1>
          <p className="text-muted-foreground">Tambah data kelas baru ke sistem.</p>
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
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}