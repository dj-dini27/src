import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get('tanggal');
    const siswaId = searchParams.get('siswaId');
    const kelasId = searchParams.get('kelasId');

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
    
    if (siswaId) {
      whereClause.siswaId = siswaId;
    }

    let absensi;
    
    if (kelasId) {
      // Get absensi for all students in a class
      absensi = await db.absensiSiswa.findMany({
        where: {
          ...whereClause,
          siswa: {
            kelasId
          }
        },
        include: {
          siswa: {
            select: {
              id: true,
              nis: true,
              nisn: true,
              nama: true,
              kelas: {
                select: {
                  id: true,
                  nama: true
                }
              }
            }
          }
        },
        orderBy: [
          {
            siswa: {
              nama: 'asc'
            }
          },
          {
            tanggal: 'desc'
          }
        ]
      });
    } else {
      absensi = await db.absensiSiswa.findMany({
        where: whereClause,
        include: {
          siswa: {
            select: {
              id: true,
              nis: true,
              nisn: true,
              nama: true,
              kelas: {
                select: {
                  id: true,
                  nama: true
                }
              }
            }
          }
        },
        orderBy: {
          tanggal: 'desc'
        }
      });
    }

    return NextResponse.json(absensi);
  } catch (error) {
    console.error('Error fetching absensi siswa:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data absensi siswa' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siswaId, tanggal, status, keterangan } = body;

    // Validasi required fields
    if (!siswaId || !tanggal || !status) {
      return NextResponse.json(
        { error: 'Siswa, tanggal, dan status wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi status
    const validStatus = ['HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT'];
    if (!validStatus.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah siswa ada
    const siswa = await db.siswa.findUnique({
      where: { id: siswaId }
    });

    if (!siswa) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 400 }
      );
    }

    // Cek duplikasi absensi untuk siswa dan tanggal yang sama
    const existingAbsensi = await db.absensiSiswa.findFirst({
      where: {
        siswaId,
        tanggal: new Date(tanggal)
      }
    });

    if (existingAbsensi) {
      return NextResponse.json(
        { error: 'Absensi untuk siswa dan tanggal ini sudah ada' },
        { status: 400 }
      );
    }

    const absensi = await db.absensiSiswa.create({
      data: {
        id: `absensi_siswa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        siswaId,
        tanggal: new Date(tanggal),
        status,
        keterangan: keterangan || null
      },
      include: {
        siswa: {
          select: {
            id: true,
            nis: true,
            nisn: true,
            nama: true,
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

    return NextResponse.json(absensi, { status: 201 });
  } catch (error) {
    console.error('Error creating absensi siswa:', error);
    return NextResponse.json(
      { error: 'Gagal menambah absensi siswa' },
      { status: 500 }
    );
  }
}