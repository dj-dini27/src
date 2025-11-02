'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Guru {
  id: string;
  nama: string;
  email: string;
  jabatan: string | null;
}

export default function EditGuruPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    jabatan: ''
  });

  useEffect(() => {
    fetchGuru();
  }, [id]);

  const fetchGuru = async () => {
    try {
      const res = await fetch(`/api/admin/guru/${id}`);
      const data = await res.json();
      
      if (res.ok) {
        setFormData({
          nama: data.nama,
          email: data.email,
          jabatan: data.jabatan || ''
        });
      } else {
        alert(data.error || 'Guru tidak ditemukan');
        router.push('/admin/guru');
      }
    } catch (error) {
      console.error("Gagal fetch data guru:", error);
      alert('Terjadi kesalahan saat mengambil data guru');
      router.push('/admin/guru');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/guru/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/guru');
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal mengupdate guru');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupdate guru');
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
        <Link href="/admin/guru">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Guru</h1>
          <p className="text-muted-foreground">Edit data guru yang ada di sistem.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Data Guru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  placeholder="Nama lengkap guru"
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
                <Label htmlFor="jabatan">Jabatan</Label>
                <Input
                  id="jabatan"
                  value={formData.jabatan}
                  onChange={(e) => handleInputChange('jabatan', e.target.value)}
                  placeholder="Contoh: Guru Matematika"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Link href="/admin/guru">
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