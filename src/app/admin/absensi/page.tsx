'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, UserCheck, Clock, AlertCircle } from 'lucide-react';

interface AbsensiSiswa {
  id: string;
  tanggal: string;
  status: string;
  keterangan: string | null;
  siswa: {
    id: string;
    nis: string;
    nama: string | null;
    kelas: {
      nama: string;
    } | null;
  };
}

interface AbsensiGuru {
  id: string;
  tanggal: string;
  status: string;
  keterangan: string | null;
  guru: {
    id: string;
    nama: string;
    jabatan: string | null;
  };
}

interface Kelas {
  id: string;
  nama: string;
}

interface Guru {
  id: string;
  nama: string;
  jabatan: string | null;
}

export default function AbsensiPage() {
  const [activeTab, setActiveTab] = useState('siswa');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kelasId, setKelasId] = useState('');
  const [guruId, setGuruId] = useState('');
  
  const [absensiSiswa, setAbsensiSiswa] = useState<AbsensiSiswa[]>([]);
  const [absensiGuru, setAbsensiGuru] = useState<AbsensiGuru[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siswaId: '',
    guruId: '',
    status: '',
    keterangan: ''
  });

  useEffect(() => {
    fetchKelas();
    fetchGuru();
    fetchAbsensiSiswa();
    fetchAbsensiGuru();
  }, [tanggal, kelasId, guruId]);

  const fetchKelas = async () => {
    try {
      const res = await fetch('/api/admin/kelas');
      const data = await res.json();
      setKelasList(data);
    } catch (error) {
      console.error("Gagal fetch data kelas:", error);
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

  const fetchAbsensiSiswa = async () => {
    try {
      const params = new URLSearchParams();
      if (tanggal) params.append('tanggal', tanggal);
      if (kelasId && kelasId !== 'all') params.append('kelasId', kelasId);
      
      const res = await fetch(`/api/admin/absensi/siswa?${params}`);
      const data = await res.json();
      setAbsensiSiswa(data);
    } catch (error) {
      console.error("Gagal fetch data absensi siswa:", error);
    }
  };

  const fetchAbsensiGuru = async () => {
    try {
      const params = new URLSearchParams();
      if (tanggal) params.append('tanggal', tanggal);
      if (guruId && guruId !== 'all') params.append('guruId', guruId);
      
      const res = await fetch(`/api/admin/absensi/guru?${params}`);
      const data = await res.json();
      setAbsensiGuru(data);
    } catch (error) {
      console.error("Gagal fetch data absensi guru:", error);
    }
  };

  const handleSubmitSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/absensi/siswa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tanggal,
          siswaId: formData.siswaId === 'all' ? '' : formData.siswaId
        }),
      });

      if (res.ok) {
        setFormData({ siswaId: '', guruId: '', status: '', keterangan: '' });
        fetchAbsensiSiswa();
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal menambah absensi siswa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambah absensi siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/absensi/guru', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tanggal,
          guruId: formData.guruId === 'all' ? '' : formData.guruId
        }),
      });

      if (res.ok) {
        setFormData({ siswaId: '', guruId: '', status: '', keterangan: '' });
        fetchAbsensiGuru();
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal menambah absensi guru');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambah absensi guru');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HADIR': return 'bg-green-100 text-green-800';
      case 'IZIN': return 'bg-yellow-100 text-yellow-800';
      case 'SAKIT': return 'bg-blue-100 text-blue-800';
      case 'ALPHA': return 'bg-red-100 text-red-800';
      case 'TERLAMBAT': return 'bg-orange-100 text-orange-800';
      case 'TIDAK': return 'bg-red-100 text-red-800';
      case 'HADIR_DILUAR_JADWAL': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Data Absensi</h1>
          <p className="text-muted-foreground">Kelola data absensi siswa dan guru.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="siswa" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Absensi Siswa
          </TabsTrigger>
          <TabsTrigger value="guru" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Absensi Guru
          </TabsTrigger>
        </TabsList>

        <TabsContent value="siswa" className="space-y-6">
          {/* Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Filter Absensi Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal-siswa">Tanggal</Label>
                  <Input
                    id="tanggal-siswa"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelas-filter">Kelas</Label>
                  <Select value={kelasId} onValueChange={setKelasId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua kelas</SelectItem>
                      {kelasList.map((kelas) => (
                        <SelectItem key={kelas.id} value={kelas.id}>
                          {kelas.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Tambah Absensi */}
          <Card>
            <CardHeader>
              <CardTitle>Tambah Absensi Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSiswa} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siswa">Siswa</Label>
                    <Select value={formData.siswaId} onValueChange={(value) => setFormData(prev => ({ ...prev, siswaId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih siswa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Pilih siswa</SelectItem>
                        {/* TODO: Fetch siswa by kelas */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status-siswa">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HADIR">Hadir</SelectItem>
                        <SelectItem value="IZIN">Izin</SelectItem>
                        <SelectItem value="SAKIT">Sakit</SelectItem>
                        <SelectItem value="ALPHA">Alpha</SelectItem>
                        <SelectItem value="TERLAMBAT">Terlambat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keterangan-siswa">Keterangan</Label>
                    <Input
                      id="keterangan-siswa"
                      value={formData.keterangan}
                      onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                      placeholder="Keterangan (opsional)"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={loading}>
                      <Clock className="w-4 h-4 mr-2" />
                      {loading ? 'Menyimpan...' : 'Tambah'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Data Absensi */}
          <Card>
            <CardHeader>
              <CardTitle>Data Absensi Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">NIS</th>
                      <th className="px-6 py-3">Nama</th>
                      <th className="px-6 py-3">Kelas</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Keterangan</th>
                      <th className="px-6 py-3">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absensiSiswa.map((absensi) => (
                      <tr key={absensi.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{absensi.siswa.nis}</td>
                        <td className="px-6 py-4">{absensi.siswa.nama || '-'}</td>
                        <td className="px-6 py-4">
                          {absensi.siswa.kelas ? <Badge variant="secondary">{absensi.siswa.kelas.nama}</Badge> : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(absensi.status)}>
                            {absensi.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">{absensi.keterangan || '-'}</td>
                        <td className="px-6 py-4">{new Date(absensi.tanggal).toLocaleDateString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guru" className="space-y-6">
          {/* Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Filter Absensi Guru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal-guru">Tanggal</Label>
                  <Input
                    id="tanggal-guru"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guru-filter">Guru</Label>
                  <Select value={guruId} onValueChange={setGuruId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih guru" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua guru</SelectItem>
                      {guruList.map((guru) => (
                        <SelectItem key={guru.id} value={guru.id}>
                          {guru.nama} {guru.jabatan && `(${guru.jabatan})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Tambah Absensi */}
          <Card>
            <CardHeader>
              <CardTitle>Tambah Absensi Guru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitGuru} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guru">Guru</Label>
                    <Select value={formData.guruId} onValueChange={(value) => setFormData(prev => ({ ...prev, guruId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih guru" />
                      </SelectTrigger>
                      <SelectContent>
                        {guruList.map((guru) => (
                          <SelectItem key={guru.id} value={guru.id}>
                            {guru.nama} {guru.jabatan && `(${guru.jabatan})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status-guru">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HADIR">Hadir</SelectItem>
                        <SelectItem value="TIDAK">Tidak Hadir</SelectItem>
                        <SelectItem value="HADIR_DILUAR_JADWAL">Hadir Di Luar Jadwal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keterangan-guru">Keterangan</Label>
                    <Input
                      id="keterangan-guru"
                      value={formData.keterangan}
                      onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                      placeholder="Keterangan (opsional)"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={loading}>
                      <Clock className="w-4 h-4 mr-2" />
                      {loading ? 'Menyimpan...' : 'Tambah'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Data Absensi */}
          <Card>
            <CardHeader>
              <CardTitle>Data Absensi Guru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Nama</th>
                      <th className="px-6 py-3">Jabatan</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Keterangan</th>
                      <th className="px-6 py-3">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absensiGuru.map((absensi) => (
                      <tr key={absensi.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{absensi.guru.nama}</td>
                        <td className="px-6 py-4">{absensi.guru.jabatan || '-'}</td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(absensi.status)}>
                            {absensi.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">{absensi.keterangan || '-'}</td>
                        <td className="px-6 py-4">{new Date(absensi.tanggal).toLocaleDateString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}