import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const kelas = await db.kelas.findUnique({
      where: { id: params.id },
      include: {
        wali: {
          select: {
            id: true,
            nama: true,
            jabatan: true
          }
        },
        pembina: {
          select: {
            id: true,
            nama: true,
            jabatan: true
          }
        },
        siswa: {
          select: {
            id: true,
            nis: true,
            nisn: true,
            nama: true,
            email: true
          },
          orderBy: {
            nama: 'asc'
          }
        },
        mapelGuru: {
          include: {
            guru: {
              select: {
                id: true,
                nama: true
              }
            },
            mapel: {
              select: {
                id: true,
                nama: true
              }
            }
          }
        }
      }
    });

    if (!kelas) {
      return NextResponse.json(
        { error: 'Kelas tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(kelas);
  } catch (error) {
    console.error('Error fetching kelas:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kelas' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nama, waliId, pembinaId } = body;

    // Cek apakah kelas ada
    const existingKelas = await db.kelas.findUnique({
      where: { id: params.id }
    });

    if (!existingKelas) {
      return NextResponse.json(
        { error: 'Kelas tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek duplikasi nama kelas (kecuali untuk kelas yang sama)
    if (nama && nama !== existingKelas.nama) {
      const duplicateKelas = await db.kelas.findFirst({
        where: {
          AND: [
            { id: { not: params.id } },
            { nama }
          ]
        }
      });

      if (duplicateKelas) {
        return NextResponse.json(
          { error: 'Nama kelas sudah digunakan oleh kelas lain' },
          { status: 400 }
        );
      }
    }

    // Validasi wali dan pembina jika ada
    if (waliId) {
      const wali = await db.guru.findUnique({
        where: { id: waliId }
      });
      if (!wali) {
        return NextResponse.json(
          { error: 'Wali kelas tidak ditemukan' },
          { status: 400 }
        );
      }
    }

    if (pembinaId) {
      const pembina = await db.guru.findUnique({
        where: { id: pembinaId }
      });
      if (!pembina) {
        return NextResponse.json(
          { error: 'Pembina tidak ditemukan' },
          { status: 400 }
        );
      }
    }

    const updatedKelas = await db.kelas.update({
      where: { id: params.id },
      data: {
        nama: nama || existingKelas.nama,
        waliId: waliId !== undefined ? waliId : existingKelas.waliId,
        pembinaId: pembinaId !== undefined ? pembinaId : existingKelas.pembinaId
      },
      include: {
        wali: {
          select: {
            id: true,
            nama: true
          }
        },
        pembina: {
          select: {
            id: true,
            nama: true
          }
        },
        _count: {
          select: {
            siswa: true
          }
        }
      }
    });

    return NextResponse.json(updatedKelas);
  } catch (error) {
    console.error('Error updating kelas:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate kelas' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek apakah kelas ada
    const existingKelas = await db.kelas.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            siswa: true,
            mapelGuru: true
          }
        }
      }
    });

    if (!existingKelas) {
      return NextResponse.json(
        { error: 'Kelas tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah kelas masih memiliki siswa atau mapel
    if (existingKelas._count.siswa > 0 || existingKelas._count.mapelGuru > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus kelas yang masih memiliki siswa atau mata pelajaran' },
        { status: 400 }
      );
    }

    // Hapus kelas
    await db.kelas.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Kelas berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting kelas:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kelas' },
      { status: 500 }
    );
  }
}