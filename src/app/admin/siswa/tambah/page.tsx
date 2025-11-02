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

interface Kelas {
  id: string;
  nama: string;
}

export default function TambahSiswaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    fetchKelas();
  }, []);

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
      const res = await fetch('/api/admin/siswa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/siswa');
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal menambah siswa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambah siswa');
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
        <Link href="/admin/siswa">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Tambah Siswa</h1>
          <p className="text-muted-foreground">Tambah data siswa baru ke sistem.</p>
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
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}