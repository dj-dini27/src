'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, Plus } from 'lucide-react';

interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  email: string;
  nama: string | null;
  kelas: { nama: string } | null;
}

export default function SiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await fetch('/api/admin/siswa');
      const data = await res.json();
      setSiswaList(data);
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
      await fetch(`/api/admin/siswa/${id}`, { method: 'DELETE' });
      fetchSiswa(); // Refresh data setelah hapus
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
          <h1 className="text-3xl font-bold">Data Siswa</h1>
          <p className="text-muted-foreground">Kelola data seluruh siswa di sekolah.</p>
        </div>
        <Link href="/admin/siswa/tambah">
          <Button><Plus className="w-4 h-4 mr-2" /> Tambah Siswa</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">NIS</th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Kelas</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {siswaList.map((siswa) => (
                  <tr key={siswa.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{siswa.nis}</td>
                    <td className="px-6 py-4">{siswa.nama || '-'}</td>
                    <td className="px-6 py-4">{siswa.email}</td>
                    <td className="px-6 py-4">
                      {siswa.kelas ? <Badge variant="secondary">{siswa.kelas.nama}</Badge> : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/admin/siswa/${siswa.id}/edit`}>
                        <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(siswa.id, siswa.nama || 'siswa ini')}>
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