import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createUserToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, nis } = body;

    // Validasi input
    if (!password) {
      return NextResponse.json(
        { error: 'Password wajib diisi' },
        { status: 400 }
      );
    }

    let user = null;

    // Login berdasarkan role
    if (role === 'ADMIN') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email wajib diisi untuk admin' },
          { status: 400 }
        );
      }

      // Cari user admin di database
      user = await db.user.findUnique({
        where: { email, role: 'ADMIN' },
        include: {
          guru: true,
          siswa: true
        }
      });

    } else if (role === 'GURU') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email wajib diisi untuk guru' },
          { status: 400 }
        );
      }

      // Cari user guru di database
      user = await db.user.findUnique({
        where: { email, role: 'GURU' },
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

    } else if (role === 'SISWA') {
      if (!nis) {
        return NextResponse.json(
          { error: 'NIS wajib diisi untuk siswa' },
          { status: 400 }
        );
      }

      // Cari siswa berdasarkan NIS
      const siswa = await db.siswa.findUnique({
        where: { nis },
        include: {
          kelas: {
            select: {
              id: true,
              nama: true
            }
          }
        }
      });

      if (siswa) {
        // Cari user terkait siswa
        const userRecord = await db.user.findUnique({
          where: { siswaId: siswa.id, role: 'SISWA' },
          include: {
            siswa: true
          }
        });

        if (userRecord) {
          user = userRecord;
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Email/NIS atau password salah' },
        { status: 401 }
      );
    }

    // Validasi password (simplified - in production use bcrypt.compare)
    const isPasswordValid = user.password === password;
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email/NIS atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await createUserToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Prepare response data
    const responseData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        guru: user.guru,
        siswa: user.siswa
      },
      token
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}