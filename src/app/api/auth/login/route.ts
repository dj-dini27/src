import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

      // Cari user admin
      user = await db.user.findUnique({
        where: { email, role: 'ADMIN' },
        include: {
          guru: true,
          siswa: true
        }
      });

      // Demo: allow default admin login
      if (!user && email === 'admin@sekolah.sch.id' && password === 'admin123') {
        user = {
          id: 'admin_demo',
          name: 'Administrator',
          email: 'admin@sekolah.sch.id',
          role: 'ADMIN',
          password: 'admin123', // In production, this should be hashed
          guruId: null,
          siswaId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

    } else if (role === 'GURU') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email wajib diisi untuk guru' },
          { status: 400 }
        );
      }

      // Cari user guru
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

      // Demo: allow default guru login
      if (!user && email === 'guru@sekolah.sch.id' && password === 'guru123') {
        user = {
          id: 'guru_demo',
          name: 'Guru Demo',
          email: 'guru@sekolah.sch.id',
          role: 'GURU',
          password: 'guru123', // In production, this should be hashed
          guruId: 'guru_demo',
          siswaId: null,
          guru: {
            id: 'guru_demo',
            nama: 'Guru Demo',
            jabatan: 'Guru Matematika'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

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

      // Demo: allow default siswa login
      if (!siswa && nis === '12345' && password === 'siswa123') {
        user = {
          id: 'siswa_demo',
          name: 'Siswa Demo',
          email: 'siswa@sekolah.sch.id',
          role: 'SISWA',
          password: 'siswa123', // In production, this should be hashed
          guruId: null,
          siswaId: 'siswa_demo',
          siswa: {
            id: 'siswa_demo',
            nis: '12345',
            nisn: '1234567890',
            nama: 'Siswa Demo',
            email: 'siswa@sekolah.sch.id',
            noHP: '08123456789',
            kelas: {
              id: 'kelas_demo',
              nama: 'XII IPA 1'
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else if (siswa) {
        // Cari user terkait siswa
        const userRecord = await db.user.findUnique({
          where: { siswaId: siswa.id, role: 'SISWA' }
        });

        if (userRecord) {
          user = {
            ...userRecord,
            siswa
          };
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Email/NIS atau password salah' },
        { status: 401 }
      );
    }

    // Validasi password (simplified for demo)
    // In production, use bcrypt.compare
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Email/NIS atau password salah' },
        { status: 401 }
      );
    }

    // Generate token (simplified for demo)
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      role: user.role,
      timestamp: Date.now()
    })).toString('base64');

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