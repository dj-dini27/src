import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      // Decode token (simplified for demo)
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired (24 hours)
      if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      }

      // Return user data based on role
      let userData = null;
      
      if (decoded.role === 'ADMIN') {
        userData = {
          id: decoded.id,
          name: 'Administrator',
          email: 'admin@sekolah.sch.id',
          role: 'ADMIN'
        };
      } else if (decoded.role === 'GURU') {
        userData = {
          id: decoded.id,
          name: 'Guru Demo',
          email: 'guru@sekolah.sch.id',
          role: 'GURU',
          guru: {
            id: decoded.id,
            nama: 'Guru Demo',
            jabatan: 'Guru Matematika'
          }
        };
      } else if (decoded.role === 'SISWA') {
        userData = {
          id: decoded.id,
          name: 'Siswa Demo',
          email: 'siswa@sekolah.sch.id',
          role: 'SISWA',
          siswa: {
            id: decoded.id,
            nis: '12345',
            nisn: '1234567890',
            nama: 'Siswa Demo',
            email: 'siswa@sekolah.sch.id',
            noHP: '08123456789',
            kelas: {
              id: 'kelas_demo',
              nama: 'XII IPA 1'
            }
          }
        };
      }

      if (!userData) {
        return NextResponse.json(
          { error: 'User tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user: userData });

    } catch (decodeError) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data user' },
      { status: 500 }
    );
  }
}