import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get('tanggal');
    const guruId = searchParams.get('guruId');

    // Build where clause
    const whereClause: any = {};
    
    if (tanggal) {
      const startDate = new Date(tanggal);
      const endDate = new Date(tanggal);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.tanggal = {
        gte: startDate,
        lte: endDate
      };
    }
    
    if (guruId) {
      whereClause.guruId = guruId;
    }

    const absensi = await db.absensiGuru.findMany({
      where: whereClause,
      include: {
        guru: {
          select: {
            id: true,
            nama: true,
            jabatan: true
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    });

    return NextResponse.json(absensi);
  } catch (error) {
    console.error('Error fetching absensi guru:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data absensi guru' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guruId, tanggal, status, keterangan } = body;

    // Validasi required fields
    if (!guruId || !tanggal || !status) {
      return NextResponse.json(
        { error: 'Guru, tanggal, dan status wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi status
    const validStatus = ['HADIR', 'TIDAK', 'HADIR_DILUAR_JADWAL'];
    if (!validStatus.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah guru ada
    const guru = await db.guru.findUnique({
      where: { id: guruId }
    });

    if (!guru) {
      return NextResponse.json(
        { error: 'Guru tidak ditemukan' },
        { status: 400 }
      );
    }

    // Cek duplikasi absensi untuk guru dan tanggal yang sama
    const existingAbsensi = await db.absensiGuru.findFirst({
      where: {
        guruId,
        tanggal: new Date(tanggal)
      }
    });

    if (existingAbsensi) {
      return NextResponse.json(
        { error: 'Absensi untuk guru dan tanggal ini sudah ada' },
        { status: 400 }
      );
    }

    const absensi = await db.absensiGuru.create({
      data: {
        id: `absensi_guru_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        guruId,
        tanggal: new Date(tanggal),
        status,
        keterangan: keterangan || null
      },
      include: {
        guru: {
          select: {
            id: true,
            nama: true,
            jabatan: true
          }
        }
      }
    });

    return NextResponse.json(absensi, { status: 201 });
  } catch (error) {
    console.error('Error creating absensi guru:', error);
    return NextResponse.json(
      { error: 'Gagal menambah absensi guru' },
      { status: 500 }
    );
  }
}