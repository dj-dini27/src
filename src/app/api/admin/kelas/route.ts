import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const kelas = await db.kelas.findMany({
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
            siswa: true,
            mapelGuru: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json(kelas);
  } catch (error) {
    console.error('Error fetching kelas:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kelas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, waliId, pembinaId } = body;

    // Validasi required fields
    if (!nama) {
      return NextResponse.json(
        { error: 'Nama kelas wajib diisi' },
        { status: 400 }
      );
    }

    // Cek duplikasi nama kelas
    const existingKelas = await db.kelas.findFirst({
      where: { nama }
    });

    if (existingKelas) {
      return NextResponse.json(
        { error: 'Nama kelas sudah terdaftar' },
        { status: 400 }
      );
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

    const kelas = await db.kelas.create({
      data: {
        nama,
        waliId: waliId || null,
        pembinaId: pembinaId || null
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

    return NextResponse.json(kelas, { status: 201 });
  } catch (error) {
    console.error('Error creating kelas:', error);
    return NextResponse.json(
      { error: 'Gagal menambah kelas' },
      { status: 500 }
    );
  }
}