'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, Plus, Users, GraduationCap } from 'lucide-react';

interface Kelas {
  id: string;
  nama: string;
  wali: { nama: string } | null;
  pembina: { nama: string } | null;
  _count: {
    siswa: number;
  };
}

export default function KelasPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKelas();
  }, []);

  const fetchKelas = async () => {
    try {
      const res = await fetch('/api/admin/kelas');
      const data = await res.json();
      setKelasList(data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas ${nama}?`)) {
      return;
    }
    try {
      await fetch(`/api/admin/kelas/${id}`, { method: 'DELETE' });
      fetchKelas();
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
          <h1 className="text-3xl font-bold">Data Kelas</h1>
          <p className="text-muted-foreground">Kelola data seluruh kelas di sekolah.</p>
        </div>
        <Link href="/admin/kelas/tambah">
          <Button><Plus className="w-4 h-4 mr-2" /> Tambah Kelas</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kelasList.map((kelas) => (
          <Card key={kelas.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{kelas.nama}</CardTitle>
                <div className="flex space-x-1">
                  <Link href={`/admin/kelas/${kelas.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(kelas.id, kelas.nama)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{kelas._count.siswa} siswa</span>
                </div>
                
                {kelas.wali && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wali Kelas</p>
                      <p className="text-sm font-medium">{kelas.wali.nama}</p>
                    </div>
                  </div>
                )}
                
                {kelas.pembina && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pembina</p>
                      <p className="text-sm font-medium">{kelas.pembina.nama}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <Link href={`/admin/kelas/${kelas.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}