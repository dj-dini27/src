import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const guru = await db.guru.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        },
        _count: {
          select: {
            waliKelas: true,
            pembina: true,
            mapel: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    // Transform data untuk frontend
    const transformedGuru = guru.map(g => ({
      id: g.id,
      nama: g.nama,
      jabatan: g.jabatan,
      email: g.user?.email || '',
      _count: g._count
    }));

    return NextResponse.json(transformedGuru);
  } catch (error) {
    console.error('Error fetching guru:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data guru' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, jabatan, email, password } = body;

    // Validasi required fields
    if (!nama || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Cek duplikasi email
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Generate guru ID
    const guruId = `guru_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user first
    const user = await db.user.create({
      data: {
        name: nama,
        email,
        password, // In production, hash this password
        role: 'GURU',
        guruId
      }
    });

    // Create guru
    const guru = await db.guru.create({
      data: {
        id: guruId,
        nama,
        jabatan: jabatan || null
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      id: guru.id,
      nama: guru.nama,
      jabatan: guru.jabatan,
      email: guru.user?.email || ''
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating guru:', error);
    return NextResponse.json(
      { error: 'Gagal menambah guru' },
      { status: 500 }
    );
  }
}