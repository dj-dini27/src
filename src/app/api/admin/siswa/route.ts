import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const siswa = await db.siswa.findMany({
      include: {
        kelas: {
          select: {
            nama: true
          }
        }
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json(siswa);
  } catch (error) {
    console.error('Error fetching siswa:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nis, nisn, email, noHP, nama, alamat, kelasId } = body;

    // Validasi required fields
    if (!nis || !nisn || !email || !noHP) {
      return NextResponse.json(
        { error: 'NIS, NISN, email, dan no HP wajib diisi' },
        { status: 400 }
      );
    }

    // Cek duplikasi NIS, NISN, dan email
    const existingSiswa = await db.siswa.findFirst({
      where: {
        OR: [
          { nis },
          { nisn },
          { email }
        ]
      }
    });

    if (existingSiswa) {
      let field = '';
      if (existingSiswa.nis === nis) field = 'NIS';
      else if (existingSiswa.nisn === nisn) field = 'NISN';
      else if (existingSiswa.email === email) field = 'Email';
      
      return NextResponse.json(
        { error: `${field} sudah terdaftar` },
        { status: 400 }
      );
    }

    const siswa = await db.siswa.create({
      data: {
        id: `siswa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nis,
        nisn,
        email,
        noHP,
        nama: nama || null,
        alamat: alamat || null,
        kelasId: kelasId || null
      },
      include: {
        kelas: {
          select: {
            nama: true
          }
        }
      }
    });

    return NextResponse.json(siswa, { status: 201 });
  } catch (error) {
    console.error('Error creating siswa:', error);
    return NextResponse.json(
      { error: 'Gagal menambah siswa' },
      { status: 500 }
    );
  }
}