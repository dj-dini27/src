'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, Plus } from 'lucide-react';

interface Guru {
  id: string;
  nama: string;
  jabatan: string | null;
  email: string;
}

export default function GuruPage() {
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuru();
  }, []);

  const fetchGuru = async () => {
    try {
      const res = await fetch('/api/admin/guru');
      const data = await res.json();
      setGuruList(data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${nama}?`)) {
      return;
    }
    try {
      await fetch(`/api/admin/guru/${id}`, { method: 'DELETE' });
      fetchGuru();
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin"/></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Data Guru</h1>
          <p className="text-muted-foreground">Kelola data seluruh guru di sekolah.</p>
        </div>
        <Link href="/admin/guru/tambah">
          <Button><Plus className="w-4 h-4 mr-2" /> Tambah Guru</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Guru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Jabatan</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {guruList.map((guru) => (
                  <tr key={guru.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{guru.nama}</td>
                    <td className="px-6 py-4">{guru.email}</td>
                    <td className="px-6 py-4">
                      {guru.jabatan ? <Badge variant="secondary">{guru.jabatan}</Badge> : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/admin/guru/${guru.id}/edit`}>
                        <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(guru.id, guru.nama)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}