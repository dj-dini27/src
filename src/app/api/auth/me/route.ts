import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT, extractJWT } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Extract token from request
    const token = extractJWT(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = await verifyJWT(token);

    // Query user from database based on decoded info
    let userData = null;
    
    if (payload.role === 'ADMIN') {
      userData = await db.user.findUnique({
        where: { id: payload.id, role: 'ADMIN' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
    } else if (payload.role === 'GURU') {
      userData = await db.user.findUnique({
        where: { id: payload.id, role: 'GURU' },
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
    } else if (payload.role === 'SISWA') {
      userData = await db.user.findUnique({
        where: { id: payload.id, role: 'SISWA' },
        include: {
          siswa: {
            include: {
              kelas: {
                select: {
                  id: true,
                  nama: true
                }
              }
            }
          }
        }
      });
    }

    if (!userData) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: userData });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data user' },
      { status: 500 }
    );
  }
}