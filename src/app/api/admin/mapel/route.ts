import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const mapel = await db.mapel.findMany({
      include: {
        _count: {
          select: {
            guru: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json(mapel);
  } catch (error) {
    console.error('Error fetching mapel:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data mata pelajaran' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama } = body;

    // Validasi required fields
    if (!nama) {
      return NextResponse.json(
        { error: 'Nama mata pelajaran wajib diisi' },
        { status: 400 }
      );
    }

    // Cek duplikasi nama mapel
    const existingMapel = await db.mapel.findFirst({
      where: { nama }
    });

    if (existingMapel) {
      return NextResponse.json(
        { error: 'Mata pelajaran sudah terdaftar' },
        { status: 400 }
      );
    }

    const mapel = await db.mapel.create({
      data: {
        id: `mapel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nama
      },
      include: {
        _count: {
          select: {
            guru: true
          }
        }
      }
    });

    return NextResponse.json(mapel, { status: 201 });
  } catch (error) {
    console.error('Error creating mapel:', error);
    return NextResponse.json(
      { error: 'Gagal menambah mata pelajaran' },
      { status: 500 }
    );
  }
}