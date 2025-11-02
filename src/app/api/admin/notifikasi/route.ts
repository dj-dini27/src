import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unread = searchParams.get('unread');
    const limit = searchParams.get('limit');

    // Build where clause
    const whereClause: any = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (unread === 'true') {
      whereClause.read = false;
    }

    const notifikasi = await db.notifikasi.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
    });

    return NextResponse.json(notifikasi);
  } catch (error) {
    console.error('Error fetching notifikasi:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data notifikasi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, message } = body;

    // Validasi required fields
    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: 'User, title, dan message wajib diisi' },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 400 }
      );
    }

    const notifikasi = await db.notifikasi.create({
      data: {
        id: `notifikasi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        title,
        message,
        read: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(notifikasi, { status: 201 });
  } catch (error) {
    console.error('Error creating notifikasi:', error);
    return NextResponse.json(
      { error: 'Gagal menambah notifikasi' },
      { status: 500 }
    );
  }
}